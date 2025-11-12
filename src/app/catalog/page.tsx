"use client";

import { fetchFishes } from "@/api/fish";
import { Fish } from "@/types/fish";
import FishCatalogCard from "@/components/FishCatalogCard";
import FishFilterButtons, { FilterType } from "@/components/FishFilterButtons";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function CatalogPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [seenFishIds, setSeenFishIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    fetchFishes().then((data) => setFishes(data));
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      const storageKey = `fishSightings_${session.user.email}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setSeenFishIds(JSON.parse(stored));
      }
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (!session?.user?.email) return;

    const checkForUpdates = () => {
      const storageKey = `fishSightings_${session.user.email}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setSeenFishIds(JSON.parse(stored));
      }
    };

    const interval = setInterval(checkForUpdates, 500);
    return () => clearInterval(interval);
  }, [session?.user?.email]);

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sonar-green text-xl font-mono">LOADING...</div>
      </div>
    );
  }

  let filteredFishes = fishes;

  if (filter === "seen") {
    filteredFishes = fishes.filter((fish) => seenFishIds.includes(fish.id));
  } else if (filter === "unseen") {
    filteredFishes = fishes.filter((fish) => !seenFishIds.includes(fish.id));
  }

  const seenCount = seenFishIds.length;
  const unseenCount = fishes.length - seenCount;

  return (
    <div className="w-full min-h-screen bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-panel-background border border-panel-border rounded-lg shadow-[--shadow-cockpit-border] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Fish Species Catalog
              </h1>
              <p className="text-text-secondary text-sm font-mono">
                USER: {session.user.email}
              </p>
            </div>
            <Link
              href="/"
              className="border border-panel-border shadow-[--shadow-cockpit-border] px-4 py-2 rounded hover:border-sonar-green hover:text-sonar-green transition-colors text-sm font-mono"
            >
              ← BACK TO MAP
            </Link>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-sm font-mono">
                <span className="text-sonar-green font-bold">{seenCount}</span>
                <span className="text-text-secondary">
                  {" "}
                  / {fishes.length} SPOTTED
                </span>
              </div>
              <div className="flex-1 bg-background rounded-full h-3 border border-panel-border overflow-hidden">
                <div
                  className="bg-sonar-green h-full transition-all duration-500"
                  style={{
                    width: `${
                      fishes.length > 0 ? (seenCount / fishes.length) * 100 : 0
                    }%`,
                  }}
                />
              </div>
              <div className="text-sm font-mono text-text-secondary">
                {fishes.length > 0
                  ? Math.round((seenCount / fishes.length) * 100)
                  : 0}
                %
              </div>
            </div>

            <FishFilterButtons
              activeFilter={filter}
              onFilterChange={setFilter}
              totalCount={fishes.length}
              seenCount={seenCount}
              unseenCount={unseenCount}
            />
          </div>

          {filteredFishes.length === 0 ? (
            <div className="text-center py-12 border border-panel-border rounded-lg bg-panel-background">
              <p className="text-xl text-text-secondary font-mono">
                {filter === "seen" && "NO FISH SPOTTED YET"}
                {filter === "unseen" && "ALL FISH SPOTTED! 🎉"}
                {filter === "all" && "LOADING..."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
              {filteredFishes.map((fish) => (
                <FishCatalogCard
                  key={fish.id}
                  fish={fish}
                  userEmail={session.user.email}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
