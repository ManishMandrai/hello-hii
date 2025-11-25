"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import UserSyncWrapper from "@/components/UserSyncWrapper";
import streamClient from "@/lib/stream";
import { Separator } from "@radix-ui/react-separator";
import { Chat } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * IncomingCallModal - small inline modal used below.
 * If you have a modal component in your UI kit, replace with that.
 */
function IncomingCallModal({
    open,
    onAccept,
    onDecline,
    callerName,
    callUrl,
}: {
    open: boolean;
    onAccept: () => void;
    onDecline: () => void;
    callerName?: string;
    callUrl?: string;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto bg-zinc-900/90 backdrop-blur-sm text-white rounded-lg p-4 shadow-xl max-w-md w-full mx-4">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <div className="font-semibold text-lg">
                            Incoming call{callerName ? ` from ${callerName}` : ""}
                        </div>
                        <div className="text-sm text-zinc-400 mt-1">
                            {callUrl ? `Call id: ${callUrl.split("/").pop()}` : ""}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onDecline}
                            className="bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded"
                            aria-label="Decline call"
                        >
                            Decline
                        </button>
                        <button
                            onClick={onAccept}
                            className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded"
                            aria-label="Accept call"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Layout({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const router = useRouter();
    

    // incoming call state
    const [incoming, setIncoming] = useState<{
        callId: string;
        callerId?: string;
        callerName?: string;
        channelId?: string;
        url?: string;
    } | null>(null);

    // audio/ringtone
    const ringtoneRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        ringtoneRef.current = new Audio("/sounds/ringtone.mp3");
        ringtoneRef.current.loop = true;
        // pre-load to reduce delay
        ringtoneRef.current.load();
        return () => {
            ringtoneRef.current?.pause();
            ringtoneRef.current = null;
        };
    }, []);

    const playRingtone = useCallback(() => {
        ringtoneRef.current?.play().catch(() => {
            // autoplay may be blocked — that's OK, user will still see modal and can accept
        });
    }, []);

    const stopRingtone = useCallback(() => {
        try {
            if (ringtoneRef.current) {
                ringtoneRef.current.pause();
                ringtoneRef.current.currentTime = 0;
            }
        } catch (e) {
            // ignore
        }
    }, []);

    // accept: go to call page and stop ringtone
    const acceptCall = useCallback(() => {
        if (!incoming) return;
        stopRingtone();
        const url = incoming.url || `/dashboard/video-call/${incoming.callId}`;
        setIncoming(null);
        router.push(url);
    }, [incoming, router, stopRingtone]);

    // decline: stop ringtone and clear
    const declineCall = useCallback(async () => {
        if (!incoming || !user?.id) {
            setIncoming(null);
            stopRingtone();
            return;
        }
        // optionally notify channel that user declined
        try {
            const ch = streamClient.channel("messaging", incoming.channelId || "");
            if (ch) {
                // not awaited, optional
                ch.sendEvent({
                    type: "call.decline",
                    call_id: incoming.callId,
                    user_id: user.id,
                    timestamp: new Date().toISOString(),
                }).catch(() => { });
            }
        } catch (e) {
            // ignore
        }

        setIncoming(null);
        stopRingtone();
    }, [incoming, stopRingtone, user?.id]);

    // listen for events across channels the user is a member of
    useEffect(() => {
        if (!user?.id) return;

        let mounted = true;
        const listeners: Array<{ channel: any; handler: (ev: any) => void }> = [];

        // query and watch channels where this user is a member
        (async () => {
            try {
                // watch all channels the user is a member of; presence and state true so we receive events
                const channels = await streamClient.queryChannels(
                    { members: { $in: [user.id] } },
                    { last_message_at: -1 },
                    { watch: true, state: true, presence: true }
                );

                if (!mounted) return;

                channels.forEach((ch: any) => {
                    const handler = (ev: any) => {
                        try {
                            // the event may be a custom object; Stream puts raw JSON into ev
                            const type = ev.type || ev?.raw?.type || ev?.rawData?.type;
                            // our custom event is "call.invite"
                            if (type === "call.invite") {
                                const payload = ev.payload || ev.rawData || ev;
                                const callId = payload.call_id || payload.callId || payload.callId;
                                const createdBy = payload.created_by || payload.user_id || payload.created_by;
                                const createdByName = payload.created_by_name || payload.createdByName || payload.name;
                                const url = payload.url;

                                // ignore invites from self
                                if (createdBy === user.id) return;

                                // show incoming call
                                setIncoming({
                                    callId: callId,
                                    callerId: createdBy,
                                    callerName: createdByName,
                                    channelId: ch.id,
                                    url,
                                });

                                // start ringtone
                                playRingtone();
                            }
                        } catch (err) {
                            console.error("incoming call handler error", err);
                        }
                    };

                    // attach the handler
                    // channel.on listens to channel events
                    try {
                        ch.on("event", handler);
                    } catch (e) {
                        // older/newer SDKs may support .on with specific event names; this is a safe attempt
                        try {
                            ch.on("call.invite", handler);
                        } catch (e2) {
                            // ignore if not supported
                            console.warn("Failed to attach channel event handler", e2);
                        }
                    }

                    listeners.push({ channel: ch, handler });
                });
            } catch (err) {
                console.error("Failed to subscribe to channels for call invites", err);
            }
        })();

        return () => {
            mounted = false;
            // remove listeners
            listeners.forEach(({ channel, handler }) => {
                try {
                    channel.off("event", handler);
                    channel.off("call.invite", handler);
                } catch (e) {
                    // ignore
                }
            });
        };
    }, [user?.id, playRingtone]);

    // clear incoming call if user navigates away / children change or after Accept/Decline
    useEffect(() => {
        if (!incoming) return;
        // timeout auto-decline after 30 seconds
        const t = setTimeout(() => {
            setIncoming(null);
            stopRingtone();
        }, 30_000);

        return () => clearTimeout(t);
    }, [incoming, stopRingtone]);

    return (
        <UserSyncWrapper>
            <Chat
                client={streamClient}
                // theme={theme === "dark" ? "messaging dark" : "messaging light"}
            >
                <SidebarProvider
                    style={
                        {
                            "--sidebar-width": "19rem",
                        } as React.CSSProperties
                    }
                >
                    <AppSidebar />
                    <SidebarInset>
                        <header className="flex h-12 shrink-0 items-center  px-4">
                            <SidebarTrigger className="menu" />
                            {/* <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-1"
                            /> */}
                        </header>

                        {/* main app content */}
                        {children}
                    </SidebarInset>
                </SidebarProvider>

                {/* incoming call modal */}
                <IncomingCallModal
                    open={!!incoming}
                    callerName={incoming?.callerName}
                    callUrl={incoming?.url}
                    onAccept={acceptCall}
                    onDecline={declineCall}
                />
            </Chat>
        </UserSyncWrapper>
    );
}

export default Layout;
