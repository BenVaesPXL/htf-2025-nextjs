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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-panel-background backdrop-blur-xl rounded-2xl shadow-[--shadow-panel] max-w-md w-full max-h-[90vh] overflow-y-auto border border-panel-border">
        {/* Header */}
        <div className="border-b border-panel-border px-6 py-5 sticky top-0 bg-panel-background backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-text-primary">
            Record Sighting
          </h2>
          <p className="text-sm text-text-secondary mt-1">{fish.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Photo Evidence{" "}
              <span className="text-text-secondary">(Optional)</span>
            </label>
            {!photo ? (
              <label className="w-full flex flex-col items-center px-4 py-8 bg-linear-to-br from-primary-blue/5 to-accent-cyan/5 border-2 border-dashed border-panel-border rounded-xl cursor-pointer hover:border-primary-blue transition-colors">
                <svg
                  className="w-12 h-12 text-text-secondary mb-3"
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
                <span className="text-sm font-medium text-text-primary">
                  Click to upload image
                </span>
                <span className="text-xs text-text-secondary mt-1">
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
                  className="w-full h-48 object-cover rounded-xl border border-panel-border"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-text-primary rounded-full w-8 h-8 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                >
                  ✕
                </button>
                <div className="mt-2 text-xs text-text-secondary truncate">
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
            className="w-full py-2.5 px-4 rounded-xl border border-panel-border bg-white/50 backdrop-blur-sm text-text-primary hover:border-primary-blue hover:bg-white transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>📍</span>
            {gettingLocation ? "Getting location..." : "Use Current Location"}
          </button>

          {/* Latitude */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Latitude{" "}
              <span className="text-text-secondary text-xs">(-90 to 90)</span>
            </label>
            <input
              type="number"
              step="0.000001"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-panel-border rounded-xl text-text-primary focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all"
              placeholder="e.g., 51.2194"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Longitude{" "}
              <span className="text-text-secondary text-xs">(-180 to 180)</span>
            </label>
            <input
              type="number"
              step="0.000001"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-panel-border rounded-xl text-text-primary focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all"
              placeholder="e.g., 5.3931"
            />
          </div>

          {/* Depth */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Depth{" "}
              <span className="text-text-secondary text-xs">(meters)</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-panel-border rounded-xl text-text-primary focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all"
              placeholder="e.g., 25.5"
            />
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Temperature{" "}
              <span className="text-text-secondary text-xs">(°C)</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-panel-border rounded-xl text-text-primary focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all"
              placeholder="e.g., 18.5"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-panel-border bg-white/50 backdrop-blur-sm text-text-secondary hover:border-text-secondary hover:text-text-primary transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-primary-blue text-white hover:bg-primary-blue/90 transition-all text-sm font-medium shadow-sm"
            >
              Record Sighting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
