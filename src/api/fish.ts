import { Fish } from "@/types/fish";
export const fetchFishes = async (): Promise<Fish[]> => {
  const response = await fetch("http://localhost:5555/api/fish");

  if (!response.ok) {
    throw new Error(`Failed to fetch fish: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
