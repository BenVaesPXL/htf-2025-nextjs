export interface Fish {
  id: string;
  name: string;
  image: string;
  rarity: string;
  latestSighting: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

export interface Sighting {
  id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  depth: number;
  temperature: number;
  spottedBy?: string; // Who spotted it
}

export type Rarity = "COMMON" | "RARE" | "EPIC";
