"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FishDetail from "@/components/FishDetail";
import { Fish } from "@/types/fish";

export default function FishDetailPage() {
  const params = useParams();
  const { id } = params;
  const [fish, setFish] = useState<Fish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFish = async () => {
      try {
        const res = await fetch(`http://localhost:5555/api/fish/${id}`);
        if (!res.ok) throw new Error("Vis niet gevonden");
        const data = await res.json();

        console.log("Fish data from API:", data);

        // Convert sightings array to latestSighting object
        if (data.sightings && data.sightings.length > 0) {
          // Sort by timestamp and get the most recent
          const sortedSightings = [...data.sightings].sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          data.latestSighting = sortedSightings[0];
          console.log("Latest sighting:", data.latestSighting);
        }

        // Gemini call
        const descRes = await fetch("/api/generate-description", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.name }),
        });
        const descData = await descRes.json();

        data.description =
          descData.description || "Geen beschrijving beschikbaar";
        setFish(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFish();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-panel-background backdrop-blur-xl rounded-2xl shadow-[--shadow-panel] border border-panel-border p-8">
            <div className="flex flex-col items-center gap-4">
              {/* Animated loader */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-panel-border"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary-blue border-t-transparent animate-spin"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Loading fish details
                </h3>
                <p className="text-sm text-text-secondary">
                  Generating AI description...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-panel-background backdrop-blur-xl rounded-2xl shadow-[--shadow-panel] border border-panel-border p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Error
                </h3>
                <p className="text-sm text-text-secondary">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 rounded-xl bg-primary-blue text-white hover:bg-primary-blue/90 transition-all text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!fish) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-panel-background backdrop-blur-xl rounded-2xl shadow-[--shadow-panel] border border-panel-border p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-primary-blue/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Fish Not Found
                </h3>
                <p className="text-sm text-text-secondary">
                  The requested fish could not be found
                </p>
              </div>
              <button
                onClick={() => window.history.back()}
                className="mt-2 px-4 py-2 rounded-xl border border-panel-border bg-white/50 backdrop-blur-sm text-text-secondary hover:text-text-primary hover:border-text-secondary transition-all text-sm font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <FishDetail fish={fish} />;
}
