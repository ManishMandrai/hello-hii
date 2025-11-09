'use client';

import React from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { useCreateNewChat } from "@/hooks/useCreateNewChat";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useChatContext } from "stream-chat-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserSearch from "./UserSearch";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { Button } from "./ui/button";

export function NewChatDialog({ children }: { children: React.ReactElement }) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Doc<"users">[]>([]);
  const [groupName, setGroupName] = useState("");
  const createNewChat = useCreateNewChat();
  const { user } = useUser();
  const { setActiveChannel } = useChatContext();

  const handleSelectUser = (user: Doc<"users">) => {
    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };
  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedUsers([]);
      setGroupName("");
    }
  };

  const handleCreateChat = async () => {
    const totalMembers = selectedUsers.length + 1;
    const idGroupChat = totalMembers > 2;

    const channel = await createNewChat({
      members: [user?.id as string, ...selectedUsers.map((u) => u.userId)],
      createdBy: user?.id as string,
      groupName: idGroupChat ? groupName.trim() || undefined : undefined,
    });
    setActiveChannel(channel);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Ensure only one child is passed */}
      <DialogTrigger asChild>{React.Children.only(children)}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new Chat</DialogTitle>
          <DialogDescription>
            Search for a user to start a new conversation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <UserSearch onSelectUser={handleSelectUser} className="w-full" />

          {selectedUsers.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm">
                Selected Users ({selectedUsers.length})
              </h4>
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 border border-gray-300 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <Image
                        src={user.imageUrl}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeUser(user._id)}
                      className="text-muted-foreground"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {selectedUsers.length > 1 && (
                <div className="space-y-2">
                  <label
                    htmlFor="groupName"
                    className="block text-sm font-medium"
                  >
                    Group Name
                  </label>
                  <input
                    id="groupName"
                    type="text"
                    placeholder="Enter a group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank to use default group name: &quot;GroupChat (
                    {selectedUsers.length} members)&quot;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="space-x-2">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            disabled={selectedUsers.length === 0}
            onClick={handleCreateChat}
          >
            {selectedUsers.length > 1
              ? `Create Group Chat (${selectedUsers.length + 1})`
              : selectedUsers.length === 1
              ? "Create Chat"
              : "Select Users"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
