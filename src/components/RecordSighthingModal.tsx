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
    photo?: string;
    photoName?: string;
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
  const [gettingLocation, setGettingLocation] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>("");

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image (JPEG, PNG, or WebP)");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
      setPhotoName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoName("");
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
      photo: photo || undefined,
      photoName: photoName || undefined,
    });

    // Reset form
    setLatitude("");
    setLongitude("");
    setDepth("");
    setTemperature("");
    setPhoto(null);
    setPhotoName("");
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
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">
              PHOTO EVIDENCE (Optional)
            </label>
            {!photo ? (
              <label className="w-full flex flex-col items-center px-4 py-6 bg-background border-2 border-dashed border-panel-border rounded cursor-pointer hover:border-sonar-green transition-colors">
                <svg
                  className="w-12 h-12 text-text-secondary mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm text-text-secondary font-mono">
                  CLICK TO UPLOAD IMAGE
                </span>
                <span className="text-xs text-text-secondary/50 font-mono mt-1">
                  JPEG, PNG, WebP (Max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={photo}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded border border-panel-border"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 bg-danger-red text-background rounded-full w-8 h-8 flex items-center justify-center hover:bg-danger-red/80 transition-colors font-bold"
                >
                  ✕
                </button>
                <div className="mt-2 text-xs text-text-secondary font-mono truncate">
                  {photoName}
                </div>
              </div>
            )}
          </div>

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
