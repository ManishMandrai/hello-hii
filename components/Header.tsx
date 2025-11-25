"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";

const Header = () => {
    const pathName = usePathname();
    const isDashboard = pathName.startsWith("/dashboard");
    return (
        <header className="flex items-center justify-between px-4 h-15 gap-5 sm:px-36">
            <Link href="/dashboard" className="font-medium  flex items-center">
                <Image
                    src="/logo.png"         
                    alt="Hello - Hii"
                    width={56}              
                    height={60}
                    className="object-contain"
                />
                <p className="text-black px-4">Heyy</p>
            </Link>
            <div >
                <Authenticated>
                    {!isDashboard && (
                        <Link href="/dashboard">
                            <Button variant="secondary" className="border-2 border-black text-amber-900">Chat</Button>
                        </Link>
                    )}
                    {/* <UserButton  /> */}
                </Authenticated>
                <Unauthenticated>
                    <SignInButton
                        mode="modal"
                        forceRedirectUrl="/dashboard"
                        signUpFallbackRedirectUrl="/dashboard"
                    >
                        <Button variant="outline" className="text-amber-900 border-2 border-black">Sign In</Button>
                    </SignInButton>
                </Unauthenticated>
            </div>
        </header>
    );
};

export default Header;
