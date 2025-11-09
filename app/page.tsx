"use client";

import Header from "@/components/Header";
import Image from "next/image";

const heroImageUrl =
  "https://plus.unsplash.com/premium_photo-1681487683141-e72c5ccd94e6?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white font-sans">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-10 py-16 md:py-24">
        <section className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-10 md:gap-16">
          {/* Left Content */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Connect. Chat.{" "}
              <span className="text-indigo-500 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                Instantly.
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto md:mx-0">
              Say hello to your new favorite chat app — secure, real-time, and
              beautifully simple. Stay connected anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-md shadow-indigo-700/30">
                Get Started
              </button>
              <button className="border border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all hover:scale-105">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <div className="relative group w-full max-w-md md:max-w-none">
              {/* Glow / background blur effect */}
              <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full group-hover:blur-[60px] transition-all duration-700"></div>
              <Image
                src={heroImageUrl}
                alt="Hero / chat illustration"
                width={600}
                height={600}
                className="relative rounded-2xl shadow-2xl object-cover transition-transform duration-700 ease-out group-hover:scale-105 w-full h-auto"
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
