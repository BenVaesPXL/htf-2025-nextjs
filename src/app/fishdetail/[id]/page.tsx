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

        // Gemini call
        const descRes = await fetch("/api/generate-description", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.name }),
        });
        const descData = await descRes.json();

        data.description = descData.description || "Geen beschrijving beschikbaar";
        setFish(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFish();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!fish) return <div>Vis niet gevonden</div>;

  return <FishDetail fish={fish} />;
}
