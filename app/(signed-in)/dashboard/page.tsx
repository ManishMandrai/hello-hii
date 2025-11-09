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
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) return null;
  if (!userId) return <RedirectToSignIn />;

  const { user } = useUser();
  const router = useRouter();
  const { channel, setActiveChannel } = useChatContext();
  const { setOpen } = useSidebar();

  const handleCall = () => {
    if (!channel) return;
    router.push(`/dashboard/video-call/${channel.id}`);
    setOpen(false);
  };


  const handleLeaveChat = async () => {
    if (!channel || !user?.id) {
        console.log ("No channel or user ID found");
        return;
    } 
    const confirm = window.confirm("Are you sure you want to leave this chat?");
    if (!confirm) return;
    
    try {
        await channel.removeMembers([user.id]);
        setActiveChannel(undefined);
        router.push('/dashboard');
    }catch(error) {
        console.error("Error leaving the chat:", error);
    }
  }

  return (
    <div className="p-10 text-black flex flex-col flex-1">
      {channel ? (
        <Channel>
          <Window>
            <div>
              {channel.data?.member_count === 1 ? (
                <ChannelHeader title="Everyone else has left this chat " />
              ) : (
                <ChannelHeader />
              )}
              <div>
                <Button variant="outline" onClick={handleCall}>
                  <VideoIcon />
                  Video Call
                </Button>
                <Button variant="outline" onClick={handleLeaveChat}>
                  Leave chat
                </Button>
              </div>
            </div>
            <MessageList />
            <div>
              <MessageInput />
            </div>
          </Window>
          <Thread />
        </Channel>
      ) : (
        <div className="text-black">No chat selected</div>
      )}
    </div>
  );
}
