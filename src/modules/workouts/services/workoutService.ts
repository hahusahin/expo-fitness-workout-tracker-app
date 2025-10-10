// Workout service - handles workout-related API calls and business logic
import { WorkoutPayload } from "@/shared/types/requests";

// Save workout to Sanity via API route
export const saveWorkout = async ({
  _id,
  userId,
  date,
  status = "completed",
  duration,
  title,
  notes,
  calendarEventId,
  exercises,
}: WorkoutPayload) => {
  const response = await fetch("/api/save-workout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _id,
      userId,
      date,
      status,
      duration,
      title,
      notes,
      calendarEventId,
      exercises,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save workout");
  }

  return response.json();
};
