"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { RedirectToSignIn, useAuth, useUser } from "@clerk/nextjs";
import { VideoIcon } from "lucide-react";
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
    <div className="p-10 text-black flex flex-col flex-1">
      {channel ? (
        <Channel>
          <Window>
            <div className="mb-4">
              {channel.data?.member_count === 1 ? (
                <ChannelHeader title="Everyone else has left this chat" />
              ) : (
                <ChannelHeader />
              )}

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={handleCall}>
                  <VideoIcon className="w-4 h-4" />
                  Video Call
                </Button>

                <Button variant="outline" onClick={handleLeaveChat}>
                  Leave Chat
                </Button>
              </div>
            </div>

            <MessageList />
            <MessageInput />
          </Window>

          <Thread />
        </Channel>
      ) : (
        <div className="text-black text-center">No chat selected</div>
      )}
    </div>
  );
}
