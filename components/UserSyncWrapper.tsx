"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { api } from "@/convex/_generated/api";
import streamClient from "@/lib/stream";
import { createToken } from "@/actions/createToken";

const UserSyncWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const upsertUser = useMutation(api.users.upsertUser);

  const syncUser = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // 1️⃣ Sync user to Convex
      await upsertUser({
        userId: user.id,
        name:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0]?.emailAddress ||
          "Unknown",
        email: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl || "",
      });

      // 2️⃣ Get Stream token
      const token = await createToken(user.id);

      // 3️⃣ Connect user to Stream
      await streamClient.connectUser(
        {
          id: user.id,
          name:
            user.fullName ||
            user.firstName ||
            user.emailAddresses[0]?.emailAddress ||
            "Unknown",
          image: user.imageUrl || "",
        },
        token
      );
    } catch (err) {
      console.error("Failed to sync user:", err);
      setError(err instanceof Error ? err.message : "Failed to sync user");
    } finally {
      setIsLoading(false);
    }
  }, [upsertUser, user]);

  const disconnectUser = useCallback(async () => {
    try {
      await streamClient.disconnectUser();
    } catch (err) {
      console.error("Failed to disconnect user", err);
    }
  }, []);

  useEffect(() => {
    if (!isUserLoaded) return;

    if (user) {
      syncUser();
    } else {
      disconnectUser();
      setIsLoading(false);
    }
  }, [user, isUserLoaded, syncUser, disconnectUser]);

  if (!isUserLoaded || isLoading) {
    return (
      <LoadingSpinner
        message={!isUserLoaded ? "Loading user..." : "Syncing user..."}
      />
    );
  }

  if (error) {
    return <div className="p-10 text-red-500">Error: {error}</div>;
  }

  return <>{children}</>;
};

export default UserSyncWrapper;
