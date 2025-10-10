import { useMutation } from "@tanstack/react-query";

interface AIGuidanceResponse {
  guidance: string;
}

interface AIGuidanceError {
  error: string;
}

export const fetchAIGuidance = async (
  exerciseName: string
): Promise<string> => {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ exerciseName }),
  });

  if (!response.ok) {
    const errorData: AIGuidanceError = await response.json();
    throw new Error(errorData.error || "Failed to get AI guidance");
  }

  const data: AIGuidanceResponse = await response.json();
  return data.guidance;
};
