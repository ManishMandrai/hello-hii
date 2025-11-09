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

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserSyncWrapper>
      <Chat client={streamClient} theme="dark">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "19rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </header>

            {/* ✅ ✅ ADD CHILDREN HERE */}
            {children}

          </SidebarInset>
        </SidebarProvider>
      </Chat>
    </UserSyncWrapper>
  );
}

export default Layout;
