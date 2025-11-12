"use client";

import { useState } from "react";
import { Fish } from "@/types/fish";

interface RecordSightingModalProps {
  fish: Fish;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sighting: {
    latitude: number;
    longitude: number;
    depth: number;
    temperature: number;
  }) => void;
}

export default function RecordSightingModal({
  fish,
  isOpen,
  onClose,
  onSubmit,
}: RecordSightingModalProps) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [depth, setDepth] = useState("");
  const [temperature, setTemperature] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
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

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const dep = parseFloat(depth);
    const temp = parseFloat(temperature);

    if (isNaN(lat) || isNaN(lon) || isNaN(dep) || isNaN(temp)) {
      alert("Please fill in all fields with valid numbers");
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      alert("Invalid coordinates");
      return;
    }

    onSubmit({
      latitude: lat,
      longitude: lon,
      depth: dep,
      temperature: temp,
    });

    // Reset form
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
            RECORD SIGHTING
          </h2>
          <p className="text-sm text-text-secondary mt-1">{fish.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Location Button */}
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={gettingLocation}
            className="w-full py-2 px-4 rounded border-2 border-panel-border bg-background text-sonar-green hover:border-sonar-green transition-colors text-sm font-mono disabled:opacity-50"
          >
            {gettingLocation
              ? "GETTING LOCATION..."
              : "📍 USE CURRENT LOCATION"}
          </button>

          {/* Latitude */}
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">
              LATITUDE (-90 to 90)
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
              LONGITUDE (-180 to 180)
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
              DEPTH (meters)
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
              TEMPERATURE (°C)
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
              RECORD SIGHTING
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
