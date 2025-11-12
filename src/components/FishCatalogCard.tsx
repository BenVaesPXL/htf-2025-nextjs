"use client";

import { Fish } from "@/types/fish";
import { getRarityBadgeClass } from "@/utils/rarity";
import Image from "next/image";
import { useState, useEffect } from "react";

interface FishCatalogCardProps {
  fish: Fish;
  userEmail: string;
}

export default function FishCatalogCard({
  fish,
  userEmail,
}: FishCatalogCardProps) {
  const [isSeen, setIsSeen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Load spotted status from localStorage when component mounts
  useEffect(() => {
    const storageKey = `fishSightings_${userEmail}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const seenIds = JSON.parse(stored);
      setIsSeen(seenIds.includes(fish.id));
    }
  }, [fish.id, userEmail]);

  // Toggle spotted status
  const handleToggle = () => {
    const storageKey = `fishSightings_${userEmail}`;
    const stored = localStorage.getItem(storageKey);
    let seenIds = stored ? JSON.parse(stored) : [];

    if (isSeen) {
      // Remove from spotted list
      seenIds = seenIds.filter((id: string) => id !== fish.id);
    } else {
      // Add to spotted list
      seenIds.push(fish.id);
    }

    localStorage.setItem(storageKey, JSON.stringify(seenIds));
    setIsSeen(!isSeen);

    // Show feedback animation
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 800);
  };

  return (
    <div
      className={`relative border rounded-lg overflow-hidden bg-panel-background shadow-[--shadow-cockpit-border] transition-all duration-300 h-full flex flex-col ${
        isSeen ? "border-sonar-green" : "border-panel-border"
      }`}
    >
      {/* Spotted Badge */}
      {isSeen && (
        <div className="absolute top-2 right-2 z-10 bg-sonar-green text-background px-3 py-1 rounded text-xs font-bold">
          ✓ SPOTTED
        </div>
      )}

      {/* Feedback Animation */}
      {showFeedback && (
        <div className="absolute inset-0 z-20 bg-sonar-green/20 flex items-center justify-center">
          <div className="bg-panel-background rounded-full p-4 shadow-xl border-2 border-sonar-green animate-pulse">
            <span className="text-3xl">{isSeen ? "✓" : "○"}</span>
          </div>
        </div>
      )}

      {/* Fish Image */}
      <div
        className={`relative h-48 w-full bg-background transition-all duration-300 flex-shrink-0 ${
          !isSeen ? "grayscale opacity-50" : ""
        }`}
      >
        <Image src={fish.image} alt={fish.name} fill className="object-cover" />
      </div>

      {/* Fish Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3
          className={`text-lg font-bold mb-2 transition-colors min-h-[3.5rem] ${
            !isSeen ? "text-text-secondary" : "text-text-primary"
          }`}
        >
          {fish.name}
        </h3>

        {/* Rarity Badge */}
        <div className="mb-3">
          <span
            className={`px-3 py-1 rounded text-xs font-bold ${getRarityBadgeClass(
              fish.rarity
            )}`}
          >
            {fish.rarity}
          </span>
        </div>

        {/* Latest Sighting Info */}
        <div
          className={`text-xs font-mono space-y-1 mb-3 flex-grow ${
            !isSeen ? "text-text-secondary/50" : "text-text-secondary"
          }`}
        >
          <div className="flex justify-between">
            <span>LAST SEEN:</span>
            <span className="text-warning-amber">
              {new Date(fish.latestSighting.timestamp).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>LAT:</span>
            <span className="text-sonar-green">
              {fish.latestSighting.latitude.toFixed(4)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>LON:</span>
            <span className="text-sonar-green">
              {fish.latestSighting.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className={`w-full py-2 px-4 rounded font-bold text-xs font-mono transition-all duration-300 mt-auto ${
            isSeen
              ? "bg-sonar-green text-background hover:bg-sonar-green/80 border-2 border-sonar-green"
              : "bg-background text-text-secondary hover:text-sonar-green border-2 border-panel-border hover:border-sonar-green"
          }`}
        >
          {isSeen ? "✓ MARK AS UNSEEN" : "○ MARK AS SEEN"}
        </button>
      </div>
    </div>
  );
}
