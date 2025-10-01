export const getDifficultyColor = (difficulty?: string): string => {
  switch (difficulty) {
    case "beginner":
      return "#10b981"; // green-500
    case "intermediate":
      return "#f59e0b"; // yellow-500
    case "advanced":
      return "#ef4444"; // red-500
    default:
      return "#6b7280"; // gray-500
  }
};

export const getDifficultyBgColor = (difficulty?: string): string => {
  switch (difficulty) {
    case "beginner":
      return "#ecfdf5"; // green-50
    case "intermediate":
      return "#fffbeb"; // yellow-50
    case "advanced":
      return "#fef2f2"; // red-50
    default:
      return "#f9fafb"; // gray-50
  }
};

export const getDifficultyColorClass = (difficulty?: string): string => {
  switch (difficulty) {
    case "beginner":
      return "text-green-500";
    case "intermediate":
      return "text-yellow-500";
    case "advanced":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};