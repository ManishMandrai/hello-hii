"use client";

import Header from "@/components/Header";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col bg-[#eaeaea] text-white font-sans min-h-screen">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-10 py-12 md:py-20">
        <section
          className="
            flex flex-col-reverse md:flex-row 
            items-center justify-between 
            w-full max-w-6xl 
            gap-10 md:gap-16
          "
        >
          {/* Left Content */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-800">
              Connect. Chat.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                Instantly. Effortlessly.
              </span>
            </h1>

            <p className="text-gray-600 text-base md:text-xl max-w-md mx-auto md:mx-0">
              Stay connected with a fast, secure, and beautifully simple chat
              experience — anytime, anywhere.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <SignInButton
                mode="modal"
                forceRedirectUrl="/dashboard"
                signUpFallbackRedirectUrl="/dashboard"
              >
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-md shadow-indigo-700/30">
                  Get Started
                </button>
              </SignInButton>

              <button className="border border-gray-600 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold transition-all hover:scale-105">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image (top on mobile) */}
          <div className="flex-1 flex justify-center w-full">
            <div className="relative group w-full max-w-xs sm:max-w-sm md:max-w-md">
              <Image
                src="/hero.png"
                alt="Hero illustration"
                width={600}
                height={600}
                className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 py-6 text-gray-500 text-sm text-center mt-auto">
        © 2025 Manish Kumar. All Rights Reserved.
        <br />
        Developed with ❤️ by{" "}
        <a
          href="https://www.devmanish.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Manish
        </a>
      </footer>
    </div>
  );
}
