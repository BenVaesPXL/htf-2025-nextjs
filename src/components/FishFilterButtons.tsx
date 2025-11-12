"use client";

export type FilterType = "all" | "seen" | "unseen";

interface FishFilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalCount: number;
  seenCount: number;
  unseenCount: number;
}

export default function FishFilterButtons({
  activeFilter,
  onFilterChange,
  totalCount,
  seenCount,
  unseenCount,
}: FishFilterButtonsProps) {
  const filters = [
    { type: "all" as FilterType, label: "All Species", count: totalCount },
    { type: "seen" as FilterType, label: "Spotted", count: seenCount },
    { type: "unseen" as FilterType, label: "Not Spotted", count: unseenCount },
  ];

  return (
    <div className="inline-flex gap-1 bg-background rounded-xl p-1">
      {filters.map(({ type, label, count }) => (
        <button
          key={type}
          onClick={() => onFilterChange(type)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeFilter === type
              ? "bg-primary-blue text-white shadow-[--shadow-glow]"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {label} <span className="opacity-60">({count})</span>
        </button>
      ))}
    </div>
  );
}
