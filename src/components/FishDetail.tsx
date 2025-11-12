"use client";

import { Fish } from "@/types/fish";
import { formatDistanceToNow } from "date-fns";
import { getRarityBadgeClass } from "@/utils/rarity";
import { useRouter } from "next/navigation";

interface FishDetailProps {
  fish: Fish;
}

export default function FishDetail({ fish }: FishDetailProps) {
  const router = useRouter();
  const { latestSighting } = fish;

  return (
    <div className="m-5 max-w-4xl mx-auto p-6 bg-panel-background rounded-xl shadow-lg border border-white">
      <button
        className="mb-4 text-sm text-sonar-green underline"
        onClick={() => router.back()}
      >
        ← Terug naar lijst
      </button>

      <h1 className="text-3xl font-extrabold text-text-primary mb-4">{fish.name}</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
        {fish.image && (
          <img
            src={fish.image}
            alt={fish.name}
            className="w-full md:w-1/2 rounded-xl shadow-md object-cover"
          />
        )}
        <div className="flex flex-col gap-2">
          {fish.rarity && (
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getRarityBadgeClass(fish.rarity)}`}
            >
              {fish.rarity}
            </span>
          )}

          {latestSighting && (
            <div className="text-sm text-text-secondary">
              <p>
                <span className="font-bold">Latitude:</span> {latestSighting.latitude?.toFixed(6) || "-"}
              </p>
              <p>
                <span className="font-bold">Longitude:</span> {latestSighting.longitude?.toFixed(6) || "-"}
              </p>
              <p>
                <span className="font-bold">Last Seen:</span>{" "}
                {latestSighting?.timestamp
                  ? formatDistanceToNow(new Date(latestSighting.timestamp), { addSuffix: true })
                  : "-"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-panel-border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Beschrijving</h2>
        <p className="text-text-secondary">{fish.description || "Geen beschrijving beschikbaar"}</p>
      </div>
    </div>
  );
}
