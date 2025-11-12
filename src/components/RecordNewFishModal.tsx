"use client";

import { useState } from "react";

interface AddFishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fish: {
    name: string;
    image: string;
    rarity: string;
    latitude: number;
    longitude: number;
    depth: number;
    temperature: number;
  }) => void;
}

export default function AddFishModal({
  isOpen,
  onClose,
  onSubmit,
}: AddFishModalProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [rarity, setRarity] = useState<"COMMON" | "RARE" | "EPIC">("COMMON");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [depth, setDepth] = useState("");
  const [temperature, setTemperature] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);

  if (!isOpen) return null;

  const handleGetCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          setGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enter manually.");
          setGettingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setGettingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a fish name");
      return;
    }

    if (!image.trim()) {
      alert("Please enter an image URL");
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const dep = parseFloat(depth);
    const temp = parseFloat(temperature);

    if (isNaN(lat) || isNaN(lon) || isNaN(dep) || isNaN(temp)) {
      alert("Please fill in all location fields with valid numbers");
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      alert("Invalid coordinates");
      return;
    }

    onSubmit({
      name: name.trim(),
      image: image.trim(),
      rarity,
      latitude: lat,
      longitude: lon,
      depth: dep,
      temperature: temp,
    });

    // Reset form
    setName("");
    setImage("");
    setRarity("COMMON");
    setLatitude("");
    setLongitude("");
    setDepth("");
    setTemperature("");
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-panel-background border-2 border-sonar-green rounded-lg shadow-[--shadow-cockpit] max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-background border-b border-panel-border p-4 sticky top-0">
          <h2 className="text-xl font-bold text-sonar-green font-mono">
            ADD NEW FISH SPECIES
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Register a new fish species in the catalog
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Fish Name */}
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">
              FISH NAME *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 bg-background border border-panel-border rounded text-text-primary font-mono focus:border-sonar-green focus:outline-none"
              placeholder="e.g., Atlantic Bluefin Tuna"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">
              IMAGE URL *
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="w-full px-4 py-2 bg-background border border-panel-border rounded text-text-primary font-mono focus:border-sonar-green focus:outline-none"
              placeholder="https://example.com/fish.jpg"
            />
            {image && (
              <div className="mt-2 relative h-32 w-full bg-background border border-panel-border rounded overflow-hidden">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-fish.png";
                  }}
                />
              </div>
            )}
          </div>

          {/* Rarity */}
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">
              RARITY *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["COMMON", "RARE", "EPIC"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRarity(r)}
                  className={`py-2 px-4 rounded font-bold text-xs font-mono transition-all ${
                    rarity === r
                      ? r === "COMMON"
                        ? "bg-sonar-green text-background border-2 border-sonar-green"
                        : r === "RARE"
                        ? "bg-warning-amber text-background border-2 border-warning-amber"
                        : "bg-danger-red text-background border-2 border-danger-red"
                      : "bg-background text-text-secondary border-2 border-panel-border hover:border-sonar-green"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-panel-border pt-4">
            <h3 className="text-sm font-mono text-sonar-green mb-3">
              FIRST SIGHTING LOCATION
            </h3>

            {/* Current Location Button */}
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
              className="w-full py-2 px-4 rounded border-2 border-panel-border bg-background text-sonar-green hover:border-sonar-green transition-colors text-sm font-mono disabled:opacity-50 mb-4"
            >
              {gettingLocation
                ? "GETTING LOCATION..."
                : "📍 USE CURRENT LOCATION"}
            </button>
          </div>

          {/* Latitude */}
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">
              LATITUDE (-90 to 90) *
            </label>
            <input
              type="number"
              step="0.000001"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              className="w-full px-4 py-2 bg-background border border-panel-border rounded text-text-primary font-mono focus:border-sonar-green focus:outline-none"
              placeholder="e.g., 51.2194"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">
              LONGITUDE (-180 to 180) *
            </label>
            <input
              type="number"
              step="0.000001"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              className="w-full px-4 py-2 bg-background border border-panel-border rounded text-text-primary font-mono focus:border-sonar-green focus:outline-none"
              placeholder="e.g., 5.3931"
            />
          </div>

          {/* Depth */}
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">
              DEPTH (meters) *
            </label>
            <input
              type="number"
              step="0.1"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              required
              className="w-full px-4 py-2 bg-background border border-panel-border rounded text-text-primary font-mono focus:border-sonar-green focus:outline-none"
              placeholder="e.g., 25.5"
            />
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">
              TEMPERATURE (°C) *
            </label>
            <input
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              required
              className="w-full px-4 py-2 bg-background border border-panel-border rounded text-text-primary font-mono focus:border-sonar-green focus:outline-none"
              placeholder="e.g., 18.5"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded border-2 border-panel-border bg-background text-text-secondary hover:border-danger-red hover:text-danger-red transition-colors text-sm font-mono"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded border-2 border-sonar-green bg-sonar-green text-background hover:bg-sonar-green/80 transition-colors text-sm font-mono font-bold"
            >
              ADD FISH
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
