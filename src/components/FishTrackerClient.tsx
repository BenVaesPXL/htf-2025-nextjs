"use client";

import { useState } from "react";
import { Fish } from "@/types/fish";
import Map from "./Map";
import FishList from "./FishList";
import FishCard from "./FishCard";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface FishTrackerClientProps {
  fishes: Fish[];
  sortedFishes: Fish[];
}

export default function FishTrackerClient({
  fishes,
  sortedFishes,
}: FishTrackerClientProps) {
  const [hoveredFishId, setHoveredFishId] = useState<string | null>(null);
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);

  // Filter fishes based on rarity
  const filteredFishes = rarityFilter
    ? sortedFishes.filter((fish) => fish.rarity.toUpperCase() === rarityFilter)
    : sortedFishes;

  const [selectedFish, setSelectedFish] = useState<Fish | null>(
    filteredFishes[0] || null
  );

  // Update selected fish when filter changes
  const handleFilterChange = (rarity: string | null) => {
    setRarityFilter(rarity);
    const newFiltered = rarity
      ? sortedFishes.filter((fish) => fish.rarity.toUpperCase() === rarity)
      : sortedFishes;
    setSelectedFish(newFiltered[0] || null);
  };

  return (
    <div className="flex-1 relative">
      {/* Fullscreen Map */}
      <div className="w-full h-full">
        <Map fishes={fishes} hoveredFishId={hoveredFishId} />
      </div>

      {/* Floating Fish Card - Bottom Left */}
      {selectedFish && (
        <div className="absolute bottom-6 left-6 z-10 w-96 space-y-3">
          <FishCard fish={selectedFish} />

          {/* Navigation Buttons Below Card */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredFishes.findIndex(
                  (f) => f.id === selectedFish.id
                );
                if (currentIndex > 0) {
                  setSelectedFish(filteredFishes[currentIndex - 1]);
                }
              }}
              disabled={filteredFishes.length <= 1}
              className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary bg-white/90 backdrop-blur-sm border border-panel-border hover:border-primary-blue hover:text-primary-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Previous
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredFishes.findIndex(
                  (f) => f.id === selectedFish.id
                );
                if (currentIndex < filteredFishes.length - 1) {
                  setSelectedFish(filteredFishes[currentIndex + 1]);
                }
              }}
              disabled={filteredFishes.length <= 1}
              className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-primary-blue text-white hover:bg-primary-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Floating Filter Pills - Bottom Center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-panel-background backdrop-blur-xl rounded-full px-4 py-2 shadow-[--shadow-cockpit] z-10">
        <button
          onClick={() => handleFilterChange(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            rarityFilter === null
              ? "bg-primary-blue text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          All Species
        </button>
        <button
          onClick={() => handleFilterChange("COMMON")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            rarityFilter === "COMMON"
              ? "bg-primary-blue text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Common
        </button>
        <button
          onClick={() => handleFilterChange("RARE")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            rarityFilter === "RARE"
              ? "bg-primary-blue text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Rare
        </button>
        <button
          onClick={() => handleFilterChange("EPIC")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            rarityFilter === "EPIC"
              ? "bg-primary-blue text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Epic
        </button>
      </div>
    </div>
  );
}
