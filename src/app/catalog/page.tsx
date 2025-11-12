import { fetchFishes } from "@/api/fish";
import FishCatalogCard from "@/components/FishCatalogCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CatalogPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const fishes = await fetchFishes();

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-panel-background border border-panel-border rounded-lg shadow-[--shadow-cockpit-border] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Fish Species Catalog
              </h1>
              <p className="text-text-secondary">
                Total species: {fishes.length}
              </p>
            </div>
            <Link
              href="/"
              className="border border-panel-border shadow-[--shadow-cockpit-border] px-4 py-2 rounded hover:border-sonar-green hover:text-sonar-green transition-colors text-sm font-mono"
            >
              ← BACK TO MAP
            </Link>
          </div>
        </div>

        {/* Fish Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {fishes.map((fish) => (
            <FishCatalogCard key={fish.id} fish={fish} />
          ))}
        </div>
      </div>
    </main>
  );
}
