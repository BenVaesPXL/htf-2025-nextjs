"use client";

import { useState } from "react";
import { Fish } from "@/types/fish";
import Map from "./Map";
import FishList from "./FishList";
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
        <div className="absolute bottom-6 left-6 w-96 bg-panel-background backdrop-blur-xl rounded-2xl shadow-[--shadow-cockpit] overflow-hidden z-10">
          {/* Fish Image */}
          <div className="relative h-48 bg-linear-to-br from-primary-blue/5 to-accent-cyan/5">
            <img
              src={selectedFish.image}
              alt={selectedFish.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-text-primary">
              {selectedFish.rarity}
            </div>
          </div>

          {/* Fish Info */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              {selectedFish.name}
            </h3>
            <div className="space-y-2 text-sm text-text-secondary mb-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {selectedFish.latestSighting.latitude.toFixed(4)}°,{" "}
                  {selectedFish.latestSighting.longitude.toFixed(4)}°
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {new Date(
                    selectedFish.latestSighting.timestamp
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const currentIndex = filteredFishes.findIndex(
                    (f) => f.id === selectedFish.id
                  );
                  if (currentIndex > 0) {
                    setSelectedFish(filteredFishes[currentIndex - 1]);
                  }
                }}
                disabled={filteredFishes.length <= 1}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary border border-panel-border hover:border-primary-blue hover:text-primary-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  const currentIndex = filteredFishes.findIndex(
                    (f) => f.id === selectedFish.id
                  );
                  if (currentIndex < filteredFishes.length - 1) {
                    setSelectedFish(filteredFishes[currentIndex + 1]);
                  }
                }}
                disabled={filteredFishes.length <= 1}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-primary-blue text-white hover:bg-primary-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
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
