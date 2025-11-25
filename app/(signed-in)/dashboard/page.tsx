"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { RedirectToSignIn, useAuth, useUser } from "@clerk/nextjs";
import { VideoIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
    Channel,
    useChatContext,
    Window,
    Thread,
    ChannelHeader,
    MessageList,
    MessageInput,
} from "stream-chat-react";

export default function Dashboard() {
    /** Hooks (always on top) */
    const { isLoaded, userId } = useAuth();
    const { user } = useUser();
    const router = useRouter();
    const { channel, setActiveChannel } = useChatContext();
    const { setOpen } = useSidebar();

    if (!isLoaded) return null;
    if (!userId) return <RedirectToSignIn />;

    const handleCall = async () => {
        if (!channel || !user?.id) return;

        // generate a stable unique call id
        const callId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

        try {
            // send a custom channel event to notify members
            // include human-readable callerName so receivers can show it immediately
            await channel.sendEvent({
                type: "call.invite",
                call_id: callId,
                created_by: user.id,
                created_by_name: user.fullName || user.firstName || user.emailAddresses?.[0]?.emailAddress || "Unknown",
                url: `/dashboard/video-call/${callId}`,
                timestamp: new Date().toISOString(),
            });

            // open local caller UI (navigate to the call page)
            setOpen(false);
            router.push(`/dashboard/video-call/${callId}`);
        } catch (err) {
            console.error("Failed to start call or send invite:", err);
            // fallback: still navigate (optional)
            setOpen(false);
            router.push(`/dashboard/video-call/${callId}`);
        }
    };

    const handleLeaveChat = async () => {
        if (!channel || !user?.id) {
            console.log("No channel or user ID found");
            return;
        }
        const confirmExit = window.confirm(
            "Are you sure you want to leave this chat?"
        );
        if (!confirmExit) return;

        try {
            await channel.removeMembers([user.id]);
            setActiveChannel(undefined);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error leaving the chat:", error);
        }
    };

    return (
        <div className="p-2  flex flex-col flex-1">
            {channel ? (
                <Channel>
                    <Window>
                        <div className="mb-4 space-y-4">
                            {channel.data?.member_count === 1 ? (
                                <ChannelHeader title="Everyone else has left this chat" />
                            ) : (
                                <ChannelHeader />
                            )}

                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" onClick={handleCall} className="flex items-center gap-2">
                                    <VideoIcon className="w-4 h-4" />
                                    Video Call
                                </Button>

                                <Button variant="outline" onClick={handleLeaveChat}>
                                    Leave Chat
                                </Button>

                                {/* NEW: Close Chat */}
                                <Button
                                    variant="outline"
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                    onClick={() => setActiveChannel(undefined)}
                                >
                                    Close Chat
                                </Button>
                            </div>
                        </div>

                        <MessageList />
                        <MessageInput />
                    </Window>

                    <Thread />
                </Channel>
            ) : (
                <div className="flex flex-1 items-center justify-center bg- text-center ">
                    <div className="flex flex-col items-center gap-6 px-6 py-12">

                        {/* App Logo */}
                        <div className="opacity-30">
                            <Image
                                width={56}
                                height={56}
                                src="/logo.png"  // <-- replace with your PNG/logo path
                                alt="App Logo"
                                className="w-20 h-20 object-contain"
                            />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
                            Welcome to Hello-Hii
                        </h2>

                        {/* Subtext */}
                        <p className="text-gray-500 text-sm md:text-base max-w-md">
                            Select a chat from the sidebar to get started.<br />
                            Stay connected with fast, reliable messaging.
                        </p>
                    </div>
                </div>

            )}
        </div>
    );
}
