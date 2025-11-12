"use client";

import { fetchFishes } from "@/api/fish";
import { Fish } from "@/types/fish";
import FishCatalogCard from "@/components/FishCatalogCard";
import FishFilterButtons, { FilterType } from "@/components/FishFilterButtons";
import AddFishModal from "@/components/RecordNewFishModal";
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Load fishes ONCE on mount
  useEffect(() => {
    const loadFishes = async () => {
      // Load API fishes
      const apiFishes = await fetchFishes();

      // Load custom fishes from localStorage
      if (session?.user?.email) {
        const storageKey = `customFish_${session.user.email}`;
        const stored = localStorage.getItem(storageKey);
        const customFish = stored ? JSON.parse(stored) : [];

        // Combine both
        setFishes([...apiFishes, ...customFish]);
      } else {
        setFishes(apiFishes);
      }
    };

    if (session?.user?.email) {
      loadFishes();
    }
  }, [session?.user?.email]);

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

  const handleAddFish = (fishData: {
    name: string;
    image: string;
    rarity: string;
    latitude: number;
    longitude: number;
    depth: number;
    temperature: number;
  }) => {
    const newFish: Fish = {
      id: `fish-${Date.now()}`,
      name: fishData.name,
      image: fishData.image,
      rarity: fishData.rarity,
      latestSighting: {
        latitude: fishData.latitude,
        longitude: fishData.longitude,
        timestamp: new Date().toISOString(),
      },
    };

    const storageKey = `customFish_${session?.user?.email}`;
    const stored = localStorage.getItem(storageKey);
    const customFish = stored ? JSON.parse(stored) : [];
    customFish.push(newFish);
    localStorage.setItem(storageKey, JSON.stringify(customFish));

    setFishes([...fishes, newFish]);
    setIsAddModalOpen(false);
    alert(`✓ ${newFish.name} added to catalog!`);
  };

  // Handle fish updates from cards
  const handleFishUpdate = (updatedFish: Fish) => {
    console.log("Updating fish:", updatedFish);

    // Update in state immediately
    setFishes((prevFishes) => {
      const newFishes = prevFishes.map((f) =>
        f.id === updatedFish.id ? updatedFish : f
      );
      console.log("New fishes state:", newFishes);
      return newFishes;
    });

    // Also update in localStorage for custom fish
    if (session?.user?.email) {
      const storageKey = `customFish_${session.user.email}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const customFish = JSON.parse(stored);
        const fishIndex = customFish.findIndex(
          (f: Fish) => f.id === updatedFish.id
        );
        if (fishIndex !== -1) {
          customFish[fishIndex] = updatedFish;
          localStorage.setItem(storageKey, JSON.stringify(customFish));
          console.log("Updated in localStorage:", updatedFish);
        }
      }
    }
  };

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
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-semibold text-text-primary mb-1 tracking-tight">
                  Species Catalog
                </h1>
                <p className="text-text-secondary text-sm">
                  {session.user.email}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary border border-panel-border hover:border-primary-blue hover:text-primary-blue transition-all"
                >
                  ← Back to Map
                </Link>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-primary-blue text-white hover:bg-primary-blue/90 shadow-[--shadow-glow] transition-all"
                >
                  + Add Species
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-panel-background rounded-2xl p-6 shadow-[--shadow-glow] mb-6">
              <div className="flex items-center gap-6 mb-4">
                <div className="text-sm">
                  <span className="text-text-primary font-semibold">
                    {seenCount}
                  </span>
                  <span className="text-text-secondary">
                    {" "}
                    / {fishes.length} spotted
                  </span>
                </div>
                <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary-blue h-full transition-all duration-500"
                    style={{
                      width: `${
                        fishes.length > 0
                          ? (seenCount / fishes.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="text-sm text-text-secondary font-medium">
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

            {/* Fish Grid */}
            {filteredFishes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-text-secondary">
                  {filter === "seen" && "No fish spotted yet"}
                  {filter === "unseen" && "All fish spotted! 🎉"}
                  {filter === "all" && "Loading..."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredFishes.map((fish) => (
                  <FishCatalogCard
                    key={fish.id}
                    fish={fish}
                    userEmail={session.user.email}
                    onFishUpdate={handleFishUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddFishModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddFish}
      />
    </>
  );
}
