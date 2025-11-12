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
}

export default function FishCatalogCard({
  fish,
  userEmail,
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
  }) => {
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

    setIsModalOpen(false);
    alert(`✓ Sighting recorded for ${fish.name}!`);
  };

  return (
    <>
      <Link href={`/catalog/${fish.id}`} className="block h-full">
        <div
          className={`relative border rounded-lg overflow-hidden bg-panel-background shadow-[--shadow-cockpit-border] transition-all duration-300 h-full flex flex-col hover:border-sonar-green cursor-pointer ${
            isSeen ? "border-sonar-green" : "border-panel-border"
          }`}
        >
          {isSeen && (
            <div className="absolute top-2 right-2 z-10 bg-sonar-green text-background px-3 py-1 rounded text-xs font-bold">
              ✓ SPOTTED
            </div>
          )}

          {showFeedback && (
            <div className="absolute inset-0 z-20 bg-sonar-green/20 flex items-center justify-center">
              <div className="bg-panel-background rounded-full p-4 shadow-xl border-2 border-sonar-green animate-pulse">
                <span className="text-3xl">{isSeen ? "✓" : "○"}</span>
              </div>
            </div>
          )}

          <div
            className={`relative h-48 w-full bg-background transition-all duration-300 flex-shrink-0 ${
              !isSeen ? "grayscale opacity-50" : ""
            }`}
          >
            <Image
              src={fish.image}
              alt={fish.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <h3
              className={`text-lg font-bold mb-2 transition-colors min-h-[3.5rem] ${
                !isSeen ? "text-text-secondary" : "text-text-primary"
              }`}
            >
              {fish.name}
            </h3>

            <div className="mb-3">
              <span
                className={`px-3 py-1 rounded text-xs font-bold ${getRarityBadgeClass(
                  fish.rarity
                )}`}
              >
                {fish.rarity}
              </span>
            </div>

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

            <div className="space-y-2 mt-auto">
              <button
                onClick={handleOpenModal}
                className="w-full py-2 px-4 rounded font-bold text-xs font-mono transition-all duration-300 bg-background text-warning-amber border-2 border-warning-amber hover:bg-warning-amber hover:text-background"
              >
                RECORD SIGHTING
              </button>

              <button
                onClick={handleToggle}
                className={`w-full py-2 px-4 rounded font-bold text-xs font-mono transition-all duration-300 ${
                  isSeen
                    ? "bg-sonar-green text-background hover:bg-sonar-green/80 border-2 border-sonar-green"
                    : "bg-background text-text-secondary hover:text-sonar-green border-2 border-panel-border hover:border-sonar-green"
                }`}
              >
                {isSeen ? "✓ MARK AS UNSEEN" : "○ MARK AS SEEN"}
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
