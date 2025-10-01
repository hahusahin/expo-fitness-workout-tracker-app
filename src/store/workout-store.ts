import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface WorkoutSet {
  id: string;
  reps: string;
  weight: string;
  weightUnit: "kg" | "lbs";
  isCompleted: boolean;
}

export interface WorkoutExercise {
  id: string;
  sanityId: string; // Store the Sanity _id
  name: string;
  sets: WorkoutSet[];
}

interface WorkoutStore {
  // These are the state variables
  workoutExercises: WorkoutExercise[];
  weightUnit: "kg" | "lbs";
  workoutStarted: boolean;

  // These are the actions that can be performed on the state
  addExerciseToWorkout: (exercise: { name: string; sanityId: string }) => void;
  removeExerciseFromWorkout: (exerciseId: string) => void;
  addSetToExercise: (exerciseId: string) => void;
  removeSetFromExercise: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  toggleSetCompletion: (exerciseId: string, setId: string) => void;
  setWorkoutExercises: (
    exercises:
      | WorkoutExercise[]
      | ((prev: WorkoutExercise[]) => WorkoutExercise[])
  ) => void;
  setWeightUnit: (unit: "kg" | "lbs") => void;
  setWorkoutStarted: (started: boolean) => void;
  resetWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      workoutExercises: [],
      weightUnit: "kg",
      workoutStarted: false,
      // actions
      addExerciseToWorkout: (exercise) =>
        set((state) => {
          const newExercise: WorkoutExercise = {
            id: Math.random().toString(),
            sanityId: exercise.sanityId,
            name: exercise.name,
            sets: [], // Start with no sets
          };
          return {
            workoutExercises: [...state.workoutExercises, newExercise],
          };
        }),
      removeExerciseFromWorkout: (exerciseId) =>
        set((state) => ({
          workoutExercises: state.workoutExercises.filter(
            (exercise) => exercise.id !== exerciseId
          ),
        })),
      addSetToExercise: (exerciseId) =>
        set((state) => ({
          workoutExercises: state.workoutExercises.map((exercise) =>
            exercise.id === exerciseId
              ? {
                  ...exercise,
                  sets: [
                    ...exercise.sets,
                    {
                      id: Math.random().toString(),
                      reps: "",
                      weight: "",
                      weightUnit: state.weightUnit,
                      isCompleted: false,
                    },
                  ],
                }
              : exercise
          ),
        })),
      removeSetFromExercise: (exerciseId, setId) =>
        set((state) => ({
          workoutExercises: state.workoutExercises.map((exercise) =>
            exercise.id === exerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.filter((set) => set.id !== setId),
                }
              : exercise
          ),
        })),
      updateSet: (exerciseId, setId, updates) =>
        set((state) => ({
          workoutExercises: state.workoutExercises.map((exercise) =>
            exercise.id === exerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map((set) =>
                    set.id === setId ? { ...set, ...updates } : set
                  ),
                }
              : exercise
          ),
        })),
      toggleSetCompletion: (exerciseId, setId) =>
        set((state) => ({
          workoutExercises: state.workoutExercises.map((exercise) =>
            exercise.id === exerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map((set) =>
                    set.id === setId
                      ? { ...set, isCompleted: !set.isCompleted }
                      : set
                  ),
                }
              : exercise
          ),
        })),
      setWorkoutExercises: (exercises) =>
        set((state) => ({
          workoutExercises:
            typeof exercises === "function"
              ? exercises(state.workoutExercises)
              : exercises,
        })),
      setWeightUnit: (unit) => set({ weightUnit: unit }),
      setWorkoutStarted: (started) => set({ workoutStarted: started }),
      resetWorkout: () => set({ workoutExercises: [], workoutStarted: false }),
    }),
    {
      name: "workout-store",
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for React Native
      partialize: (state) => ({ weightUnit: state.weightUnit }), // Only persist weightUnit
    }
  )
);
