"use client";

import { UserInfo } from "./AuthProvider";
import FishTrackerClient from "./FishTrackerClient";
import { Fish } from "@/types/fish";
import Link from "next/link";

interface FishTrackerLayoutProps {
  fishes: Fish[];
  sortedFishes: Fish[];
}

export default function FishTrackerLayout({
  fishes,
  sortedFishes,
}: FishTrackerLayoutProps) {
  return (
    <div className="w-full h-screen flex flex-col relative bg-background">
      {/* Floating Header - Minimal & Clean */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 bg-panel-background backdrop-blur-xl rounded-2xl px-6 py-3 shadow-[--shadow-cockpit]">
          <div className="w-2 h-2 rounded-full bg-primary-blue"></div>
          <div className="text-xl font-semibold text-text-primary tracking-tight">
            FishTracker
          </div>
          <div className="h-4 w-px bg-panel-border"></div>
          <div className="text-sm text-text-secondary">
            {fishes.length} species
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/catalog"
            className="bg-panel-background backdrop-blur-xl rounded-2xl px-3 py-3 shadow-[--shadow-cockpit] text-m font-medium text-text-primary hover:bg-primary-blue hover:text-white hover:shadow-[--shadow-panel] transition-all"
          >
            View Catalog
          </Link>
          <div className="bg-panel-background backdrop-blur-xl rounded-2xl px-4 py-3 shadow-[--shadow-cockpit]">
            <UserInfo />
          </div>
        </div>
      </div>

      {/* Fullscreen Map with Floating Fish Cards */}
      <FishTrackerClient fishes={fishes} sortedFishes={sortedFishes} />
    </div>
  );
}
