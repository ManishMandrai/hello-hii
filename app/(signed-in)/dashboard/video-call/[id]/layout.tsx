"use client";

import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  Call,
  CallingState,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { StatusCard } from "@/components/StatusCard";
import { AlertTriangle, Video } from "lucide-react";
import { createToken } from "@/actions/createToken";

import "@stream-io/video-react-sdk/dist/css/styles.css";

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_STREAM_API_KEY env variable");
}

function Layout({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { id } = useParams();
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  const streamUser = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      name:
        user.fullName ||
        user.emailAddresses[0]?.emailAddress ||
        "Unknown",
      image: user.imageUrl || "",
      type: "authenticated" as const,
    };
  }, [user]);

  const tokenProvider = useCallback(async () => {
    if (!user?.id) {
      throw new Error("User not loaded");
    }
    return await createToken(user.id);
  }, [user?.id]);

  /** ✅ create client */
  useEffect(() => {
    if (!streamUser) {
      setClient(null);
      return;
    }

    const newClient = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY as string,
      user: streamUser,
      tokenProvider,
    });

    setClient(newClient);

    return () => {
      newClient.disconnectUser().catch(console.error);
    };
  }, [streamUser, tokenProvider]);

  /** ✅ join call */
  useEffect(() => {
    if (!client || !id) return;

    setError(null);

    const streamCall = client.call("default", id as string);

    const joinCall = async () => {
      try {
        await streamCall.join({ create: true });
        setCall(streamCall);
      } catch (err) {
        console.error("Error joining call:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error occurred while joining the call."
        );
      }
    };

    joinCall();

    return () => {
      if (
        streamCall &&
        streamCall.state.callingState === CallingState.JOINED
      ) {
        streamCall.leave().catch(console.error);
      }
    };
  }, [client, id]);

  /** ERROR */
  if (error) {
    return (
      <StatusCard
        title="Error joining call"
        description={error}
        className="min-h-screen bg-red-400"
        action={
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-500"
          >
            Retry
          </button>
        }
      >
        <div className="w-16 h-16">
          <AlertTriangle className="w-full h-full text-white" />
        </div>
      </StatusCard>
    );
  }

  /** Loading client */
  if (!client) {
    return (
      <StatusCard
        title="Initializing client..."
        description="Setting up connection"
        className="min-h-screen bg-blue-400"
      >
        <div>Loading...</div>
      </StatusCard>
    );
  }

  /** Loading call */
  if (!call) {
    return (
      <StatusCard title="Joining call..." className="min-h-screen">
        <div className="w-18 h-18 flex flex-col gap-2 items-center">
          <Video className="w-8 h-8" />
          <div>Call ID: {id}</div>
        </div>
      </StatusCard>
    );
  }

  /** ✅ Render video call */
  return (
    <StreamVideo client={client}>
      <StreamTheme className="text-white">
        <StreamCall call={call}>{children}</StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
}

export default Layout;


