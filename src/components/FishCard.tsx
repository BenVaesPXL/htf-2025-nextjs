"use client";

import { formatDistanceToNow } from "date-fns";
import { Fish } from "@/types/fish";
import { getRarityBadgeClass } from "@/utils/rarity";
import { useRouter } from "next/navigation";

interface FishCardProps {
  fish: Fish;
}

export default function FishCard({ fish }: FishCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/fishdetail/${fish.id}`);
  };

  return (
    <div
      className="border border-panel-border shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleClick}
    >

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">{fish.name}</h2>
          {fish.rarity && (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getRarityBadgeClass(fish.rarity)}`}>
              {fish.rarity}
            </span>
          )}
        </div>
        {fish.latestSighting && (
          <div className="text-xs font-mono text-text-secondary">
            <p>LAT: {fish.latestSighting.latitude.toFixed(6)}</p>
            <p>LON: {fish.latestSighting.longitude.toFixed(6)}</p>
            <p>
              LAST SEEN: {formatDistanceToNow(new Date(fish.latestSighting.timestamp), { addSuffix: true })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
