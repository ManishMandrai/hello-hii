"use client";

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

      <DialogContent
        // responsive sizing: full width on mobile, constrained on larger screens
        className="w-[90%] max-w-lg sm:max-w-2xl py-8 sm:mx-auto p-4 sm:p-6"
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle>Start a new Chat</DialogTitle>
              <DialogDescription>
                Search and select users to start a conversation
              </DialogDescription>
            </div>

            {/* Close icon (optional) */}
    
          </div>
        </DialogHeader>

        {/* Main content: mobile-first stacked, switches to two-column on sm+ */}
        <div className="mt-4 space-y-4 sm:space-y-0 sm:flex sm:items-start sm:gap-6">
          {/* LEFT: User search (flex-grow) */}
          <div className="sm:flex-1">
            <UserSearch onSelectUser={handleSelectUser} className="w-full" />

            {/* On mobile show a horizontal preview of selected users (compact) */}
            {selectedUsers.length > 0 && (
              <div className="mt-3 sm:hidden">
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {selectedUsers.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center space-x-2 bg-muted/10 dark:bg-muted/20 px-2 py-1 rounded-md min-w-[120px]"
                    >
                      <Image
                        src={u.imageUrl}
                        alt={u.name}
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {u.email}
                        </p>
                      </div>
                      <button
                        onClick={() => removeUser(u._id)}
                        className="ml-2 p-1 rounded hover:bg-muted/20"
                        aria-label={`Remove ${u.name}`}
                      >
                        <XIcon className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Selected users & group name (fixed width on >= sm) */}
          <div className="sm:w-[320px]">
            {selectedUsers.length > 0 ? (
              <div>
                <h4 className="text-sm font-semibold mb-2">
                  Selected Users ({selectedUsers.length})
                </h4>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                  {selectedUsers.map((sel) => (
                    <div
                      key={sel._id}
                      className="flex items-center justify-between p-2 border rounded-md border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-black/40"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="flex-shrink-0">
                          <Image
                            src={sel.imageUrl}
                            alt={sel.name}
                            width={44}
                            height={44}
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {sel.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {sel.email}
                          </p>
                        </div>
                      </div>

                      <div className="ml-3">
                        <button
                          onClick={() => removeUser(sel._id)}
                          className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900"
                          aria-label={`Remove ${sel.name}`}
                        >
                          <XIcon className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Group name input (only when >1 selected) */}
                {selectedUsers.length > 1 && (
                  <div className="mt-3">
                    <label
                      htmlFor="groupName"
                      className="block text-sm font-medium mb-1"
                    >
                      Group Name
                    </label>
                    <input
                      id="groupName"
                      type="text"
                      placeholder="Enter a group name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/60 dark:bg-black/40"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave blank to use default:{" "}
                      <span className="font-medium">GroupChat ({selectedUsers.length} members)</span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No users selected yet.
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-5">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              disabled={selectedUsers.length === 0}
              onClick={handleCreateChat}
              className="w-full sm:w-auto"
            >
              {selectedUsers.length > 1
                ? `Create Group Chat (${selectedUsers.length + 1})`
                : selectedUsers.length === 1
                ? "Create Chat"
                : "Select Users"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
