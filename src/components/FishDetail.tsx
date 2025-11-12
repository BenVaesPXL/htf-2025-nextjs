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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          className="mb-6 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary-blue transition-colors"
          onClick={() => router.back()}
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to map
        </button>

        {/* Main Card */}
        <div className="bg-panel-background backdrop-blur-xl rounded-2xl shadow-[--shadow-panel] border border-panel-border overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-panel-border">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-text-primary mb-2">
                  {fish.name}
                </h1>
                {fish.rarity && (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRarityBadgeClass(
                      fish.rarity
                    )}`}
                  >
                    {fish.rarity}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image */}
              {fish.image && (
                <div className="lg:w-1/2">
                  <div className="relative h-80 bg-linear-to-br from-primary-blue/5 to-accent-cyan/5 rounded-2xl overflow-hidden">
                    <img
                      src={fish.image}
                      alt={fish.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="lg:w-1/2 space-y-6">
                {/* Latest Sighting */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-panel-border">
                  <h2 className="text-lg font-semibold text-text-primary mb-4">
                    Latest Sighting
                  </h2>
                  {latestSighting ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-text-secondary"
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
                        <div className="flex-1">
                          <div className="text-text-secondary text-xs mb-1">
                            Coordinates
                          </div>
                          <div className="flex gap-3">
                            <div>
                              <span className="text-text-secondary text-xs">
                                LAT
                              </span>
                              <div className="text-text-primary font-medium">
                                {latestSighting.latitude?.toFixed(6) || "-"}°
                              </div>
                            </div>
                            <div>
                              <span className="text-text-secondary text-xs">
                                LON
                              </span>
                              <div className="text-text-primary font-medium">
                                {latestSighting.longitude?.toFixed(6) || "-"}°
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-text-secondary"
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
                        <div>
                          <div className="text-text-secondary text-xs mb-0.5">
                            Last Seen
                          </div>
                          <div className="text-text-primary font-medium">
                            {latestSighting?.timestamp
                              ? formatDistanceToNow(
                                  new Date(latestSighting.timestamp),
                                  { addSuffix: true }
                                )
                              : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg
                        className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <p className="text-sm text-text-secondary">
                        No sighting data available yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-panel-border">
                  <h2 className="text-lg font-semibold text-text-primary mb-3">
                    Description
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {fish.description || "No description available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
