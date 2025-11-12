"use client";

import { Fish } from "@/types/fish";
import { getRarityBadgeClass } from "@/utils/rarity";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import RecordSightingModal from "./RecordSighthingModal";

interface FishCatalogCardProps {
  fish: Fish;
  userEmail: string;
  onFishUpdate?: (updatedFish: Fish) => void;
}

export default function FishCatalogCard({
  fish,
  userEmail,
  onFishUpdate,
}: FishCatalogCardProps) {
  const [isSeen, setIsSeen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storageKey = `fishSightings_${userEmail}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const seenIds = JSON.parse(stored);
      setIsSeen(seenIds.includes(fish.id));
    }
  }, [fish.id, userEmail]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const storageKey = `fishSightings_${userEmail}`;
    const stored = localStorage.getItem(storageKey);
    let seenIds = stored ? JSON.parse(stored) : [];

    if (isSeen) {
      seenIds = seenIds.filter((id: string) => id !== fish.id);
    } else {
      seenIds.push(fish.id);
    }

    localStorage.setItem(storageKey, JSON.stringify(seenIds));
    setIsSeen(!isSeen);

    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 800);
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleSightingSubmit = (sighting: {
    latitude: number;
    longitude: number;
    depth: number;
    temperature: number;
    photo?: string;
    photoName?: string;
  }) => {
    // Save the sighting
    const storageKey = `userSightings_${userEmail}`;
    const stored = localStorage.getItem(storageKey);
    const sightings = stored ? JSON.parse(stored) : [];

    const newSighting = {
      id: `sighting-${Date.now()}`,
      fishId: fish.id,
      fishName: fish.name,
      timestamp: new Date().toISOString(),
      spottedBy: userEmail,
      ...sighting,
    };

    sightings.push(newSighting);
    localStorage.setItem(storageKey, JSON.stringify(sightings));

    // Create updated fish with new sighting
    const updatedFish: Fish = {
      ...fish,
      latestSighting: {
        latitude: sighting.latitude,
        longitude: sighting.longitude,
        timestamp: newSighting.timestamp,
      },
    };

    // Update in localStorage for custom fish
    const customFishKey = `customFish_${userEmail}`;
    const customStored = localStorage.getItem(customFishKey);
    if (customStored) {
      const customFish = JSON.parse(customStored);
      const fishIndex = customFish.findIndex((f: Fish) => f.id === fish.id);
      if (fishIndex !== -1) {
        customFish[fishIndex] = updatedFish;
        localStorage.setItem(customFishKey, JSON.stringify(customFish));
      }
    }

    // Call parent callback to update state
    if (onFishUpdate) {
      onFishUpdate(updatedFish);
    }

    setIsModalOpen(false);

    const photoMsg = sighting.photo ? " with photo evidence" : "";
    alert(`✓ Sighting recorded for ${fish.name}${photoMsg}!`);
  };

  return (
    <>
      <Link href={`/catalog/${fish.id}`} className="block h-full">
        <div
          className={`relative rounded-2xl overflow-hidden bg-panel-background transition-all duration-200 h-full flex flex-col cursor-pointer hover:shadow-[--shadow-panel] ${
            isSeen
              ? "ring-2 ring-success-green/30"
              : "ring-1 ring-panel-border hover:ring-primary-blue/30"
          }`}
        >
          {isSeen && (
            <div className="absolute top-3 right-3 z-10 bg-success-green text-white px-3 py-1 rounded-full text-xs font-semibold">
              ✓ Spotted
            </div>
          )}

          {showFeedback && (
            <div className="absolute inset-0 z-20 bg-success-green/10 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-panel-background rounded-full p-4 shadow-[--shadow-panel] animate-pulse">
                <span className="text-3xl">{isSeen ? "✓" : "○"}</span>
              </div>
            </div>
          )}

          <div
            className={`relative h-48 w-full bg-gradient-to-br from-primary-blue/5 to-accent-cyan/5 transition-all duration-300 flex-shrink-0 ${
              !isSeen ? "grayscale opacity-60" : ""
            }`}
          >
            <Image
              src={fish.image}
              alt={fish.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-5 flex flex-col flex-grow">
            <h3
              className={`text-base font-semibold mb-2 transition-colors min-h-12 ${
                !isSeen ? "text-text-secondary" : "text-text-primary"
              }`}
            >
              {fish.name}
            </h3>

            <div className="mb-4">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRarityBadgeClass(
                  fish.rarity
                )}`}
              >
                {fish.rarity}
              </span>
            </div>

            <div
              key={fish.latestSighting.timestamp}
              className={`text-xs space-y-1.5 mb-4 flex-grow ${
                !isSeen ? "text-text-secondary/50" : "text-text-secondary"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-3.5 h-3.5"
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
                <span className={!isSeen ? "" : "text-text-primary"}>
                  {new Date(fish.latestSighting.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-3.5 h-3.5"
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
                </svg>
                <span className={!isSeen ? "" : "text-text-primary"}>
                  {fish.latestSighting.latitude.toFixed(2)}°,{" "}
                  {fish.latestSighting.longitude.toFixed(2)}°
                </span>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              <button
                onClick={handleOpenModal}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all bg-primary-blue text-white hover:bg-primary-blue/90"
              >
                Record Sighting
              </button>

              <button
                onClick={handleToggle}
                className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                  isSeen
                    ? "bg-success-green/10 text-success-green hover:bg-success-green/20"
                    : "border border-panel-border text-text-secondary hover:border-primary-blue hover:text-primary-blue"
                }`}
              >
                {isSeen ? "Mark as Unseen" : "Mark as Seen"}
              </button>
            </div>
          </div>
        </div>
      </Link>

      <RecordSightingModal
        fish={fish}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSightingSubmit}
      />
    </>
  );
}
