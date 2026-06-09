"use client";
import { ReactNode } from "react";

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className="w-full max-w-sm bg-white relative overflow-hidden flex flex-col"
        style={{ minHeight: "100svh", maxHeight: "100svh" }}
      >
        {/* Status bar mock */}
        <div className="flex items-center justify-between px-4 py-1 bg-white text-xs text-gray-500 border-b border-gray-100 flex-shrink-0">
          <span>9:41</span>
          <span>●●●</span>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
