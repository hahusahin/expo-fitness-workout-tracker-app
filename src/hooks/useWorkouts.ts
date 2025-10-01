import { client } from "@/lib/sanity/client";
import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { defineQuery } from "groq";
import { WorkoutPayload } from "@/types/requests";

export const getWorkoutsQuery =
  defineQuery(`*[_type == "workout" && userId == $userId] | order(date desc) {
    _id,
    date,
    duration,
    exercises[] {
      exercise->{
        _id,
        name
      },
      sets[] {
        repetitions,
        weight,
        weightUnit,
        _type,
        _key
      },
      _type,
      _key
    }
  }`);

export const useGetWorkouts = (userId: string) => {
  return useQuery({
    queryKey: ["workouts", userId],
    queryFn: async (): Promise<GetWorkoutsQueryResult> => {
      const workouts = await client.fetch(getWorkoutsQuery, { userId });
      return workouts;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
};

interface SaveWorkoutParams {
  workoutPayload: WorkoutPayload;
}

export const useSaveWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workoutPayload }: SaveWorkoutParams) => {
      const response = await fetch("/api/save-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workoutPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save workout");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate workout-related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
};

interface DeleteWorkoutParams {
  workoutId: string;
}

export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workoutId }: DeleteWorkoutParams) => {
      const response = await fetch("/api/delete-workout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workoutId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete workout");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch workout history
      queryClient.invalidateQueries({ queryKey: ["workouts"] });

      // Remove the deleted workout from cache immediately
      queryClient.setQueryData(["workouts"], (old: any) => {
        if (!old) return old;
        return old.filter(
          (workout: any) => workout._id !== variables.workoutId
        );
      });
    },
  });
};
