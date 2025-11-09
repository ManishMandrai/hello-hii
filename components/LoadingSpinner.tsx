"use client";
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-transparent h">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-14 h-14 border-4 border-gray-700 border-t-[#7c3aed] rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-gray-300 text-lg font-medium tracking-wide">
          Connecting to Chat...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
