"use client";

import { formatDistanceToNow } from "date-fns";
import { Fish } from "@/types/fish";
import { getRarityBadgeClass } from "@/utils/rarity";
import { useRouter } from "next/navigation";

interface FishCardProps {
  fish: Fish;
  className?: string;
}

export default function FishCard({ fish, className = "" }: FishCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/fishdetail/${fish.id}`);
  };

  return (
    <div
      className={`bg-panel-background backdrop-blur-xl rounded-2xl shadow-[--shadow-cockpit] overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 ${className}`}
      onClick={handleClick}
    >
      {/* Fish Image */}
      <div className="relative h-48 bg-linear-to-br from-primary-blue/5 to-accent-cyan/5">
        <img
          src={fish.image}
          alt={fish.name}
          className="w-full h-full object-cover"
        />
        {fish.rarity && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-text-primary">
            {fish.rarity}
          </div>
        )}
      </div>

      {/* Fish Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {fish.name}
        </h3>
        {fish.latestSighting && (
          <div className="space-y-2 text-sm text-text-secondary">
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
                {fish.latestSighting.latitude.toFixed(4)}°,{" "}
                {fish.latestSighting.longitude.toFixed(4)}°
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
                {new Date(fish.latestSighting.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
