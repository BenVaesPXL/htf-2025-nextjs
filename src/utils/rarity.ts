export const getRarityOrder = (rarity: string): number => {
  switch (rarity.toUpperCase()) {
    case "EPIC":
      return 0;
    case "RARE":
      return 1;
    case "COMMON":
      return 2;
    default:
      return 3;
  }
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity.toUpperCase()) {
    case "RARE":
      return "var(--warning-amber)";
    case "EPIC":
      return "var(--danger-red)";
    default:
      return "var(--sonar-green)";
  }
};

export const getRarityBadgeClass = (rarity: string): string => {
  switch (rarity.toUpperCase()) {
    case "EPIC":
      return "bg-secondary-purple/10 text-secondary-purple ring-1 ring-secondary-purple/20";
    case "RARE":
      return "bg-warning-orange/10 text-warning-orange ring-1 ring-warning-orange/20";
    case "COMMON":
      return "bg-success-green/10 text-success-green ring-1 ring-success-green/20";
    default:
      return "bg-primary-blue/10 text-primary-blue ring-1 ring-primary-blue/20";
  }
};

export const getRarityPulseClass = (rarity: string): string => {
  switch (rarity.toUpperCase()) {
    case "EPIC":
      return "animate-ping-epic"; // Fastest pulse for epic (0.8s)
    case "RARE":
      return "animate-ping-rare"; // Medium pulse for rare (1.2s)
    default:
      return "animate-ping-common"; // Slowest pulse for common (2s)
  }
};
