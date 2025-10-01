import { useQuery } from "@tanstack/react-query";
import { defineQuery } from "groq";
import { client } from "@/lib/sanity/client";
import { EXERCISES_QUERYResult } from "@/lib/sanity/types";

// GROQ query to fetch all active exercises
export const EXERCISES_QUERY =
  defineQuery(`  *[_type == "exercise" && isActive == true] | order(name asc) {
    ...
  }`);

// GROQ query to fetch a single exercise by ID
export const SINGLE_EXERCISE_QUERY =
  defineQuery(`*[_type == "exercise" && _id == $id][0] {
    ...
  }`);

export const useGetExercises = () => {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async (): Promise<EXERCISES_QUERYResult> => {
      const exercises = await client.fetch(EXERCISES_QUERY);
      return exercises;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetSingleExercise = (id: string) => {
  return useQuery({
    queryKey: ["exercise", id],
    queryFn: async () => {
      const exercise = await client.fetch(SINGLE_EXERCISE_QUERY, { id });
      return exercise || null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
