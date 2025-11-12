import { Fish } from "@/types/fish";
import { getRarityBadgeClass } from "@/utils/rarity";
import Image from "next/image";

interface FishCatalogCardProps {
  fish: Fish;
}

export default function FishCatalogCard({ fish }: FishCatalogCardProps) {
  return (
    <div className="border border-panel-border rounded-lg overflow-hidden bg-panel-background shadow-[--shadow-cockpit-border]">
      {/* Fish Image */}
      <div className="relative h-48 w-full bg-background">
        <Image src={fish.image} alt={fish.name} fill className="object-cover" />
      </div>

      {/* Fish Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-text-primary mb-2">
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
        <div className="text-xs font-mono text-text-secondary space-y-1">
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
      </div>
    </div>
  );
}
