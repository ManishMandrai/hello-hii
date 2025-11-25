"use client";
import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({
  message = "Connecting to Chat...",
  size = "lg",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses =
    size === "lg"
      ? "w-14 h-14"
      : size === "md"
      ? "w-10 h-10"
      : "w-6 h-6";

  return (
    <div
      className={`flex items-center justify-center mt-50% bg-transparent ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className={`${sizeClasses} border-4 border-gray-700 border-t-[#7c3aed] rounded-full animate-spin`}
        ></div>

        {/* Text */}
        <p className="text-gray-300 text-lg font-medium tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
