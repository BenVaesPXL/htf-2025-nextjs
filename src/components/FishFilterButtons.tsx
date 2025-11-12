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
    { type: "all" as FilterType, label: "ALL FISH", count: totalCount },
    { type: "seen" as FilterType, label: "SPOTTED", count: seenCount },
    { type: "unseen" as FilterType, label: "NOT SPOTTED", count: unseenCount },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map(({ type, label, count }) => (
        <button
          key={type}
          onClick={() => onFilterChange(type)}
          className={`px-4 py-2 rounded font-bold text-xs font-mono transition-all duration-300 ${
            activeFilter === type
              ? "bg-sonar-green text-background border-2 border-sonar-green"
              : "bg-background text-text-secondary hover:text-sonar-green border-2 border-panel-border hover:border-sonar-green"
          }`}
        >
          {label} <span className="ml-1 opacity-75">({count})</span>
        </button>
      ))}
    </div>
  );
}
