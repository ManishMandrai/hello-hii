'use client";';
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { ChannelList } from "stream-chat-react";
import { ChannelFilters, ChannelSort } from "stream-chat";
import { NewChatDialog } from "./NewChatDialog";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const filters: ChannelFilters = {
    members: { $in: [user?.id as string] },
    type: { $in: ["messaging", "team"] },
  };
  const options = { presence: true, state: true };
  const sort: ChannelSort = {
    last_message_at: -1,
  };
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center justify-between w-full px-2">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Logged in as
                  </span>
                  <span className="text-sm font-semibold">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                      {/* ⭐ Add Clerk User button here */}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8", // size adjust
                    },
                  }}
                  afterSignOutUrl="/sign-in"
                />
                
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <NewChatDialog>
              <Button variant="outline" size="sm">
                New Chat
              </Button>
            </NewChatDialog>
            <ChannelList
              filters={filters}
              sort={sort}
              options={options}
              EmptyStateIndicator={() => (
                <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                  <div className="text-6xl mb-6 opacity-25">💬</div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    No Chats Yet
                  </h2>
                  <p className="text-center text-sm text-muted-foreground">
                    You have no chats at the moment. Start a new chat by
                    clicking the New Chat button above.
                  </p>
                </div>
              )}
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
