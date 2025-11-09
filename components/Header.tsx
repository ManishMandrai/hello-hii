"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const Header = () => {
  const pathName = usePathname();
  const isDashboard = pathName.startsWith("/dashboard");
  return (
    <header className="flex items-center justify-between px-4 h-15 gap-5 sm:px-6">
      <Link
        href="/dashboard"
        className="font-medium uppercase  "
      >
        Beam
      </Link>
      <div >
        <Authenticated>
          {!isDashboard && (
            <Link href="/dashboard">
              <Button variant="secondary" className="text-amber-900">Dashboard</Button>
            </Link>
          )}
          <UserButton />
        </Authenticated>
        <Unauthenticated>
          <SignInButton
            mode="modal"
            forceRedirectUrl="/dashboard"
            signUpFallbackRedirectUrl="/dashboard"
          >
            <Button variant="outline" className="text-amber-900">Sign In</Button>
          </SignInButton>
        </Unauthenticated>
      </div>
    </header>
  );
};

export default Header;
