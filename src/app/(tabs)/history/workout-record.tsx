import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useDeleteWorkout, useGetWorkouts } from "@/hooks/useWorkouts";
import { formatDuration } from "@/utils/timeUtils";
import ExerciseCard from "@/components/WorkoutHistory/ExerciseCard";

export default function WorkoutRecord() {
  const { workoutId } = useLocalSearchParams();
  const { user } = useUser();
  const router = useRouter();

  // Find the specific workout from the existing data
  const { data: workouts, isLoading } = useGetWorkouts(user?.id || "");
  const workout = workouts?.find((w) => w._id === workoutId);

  const deleteWorkoutMutation = useDeleteWorkout();

  const handleDeleteWorkout = () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteWorkoutMutation.mutateAsync({
                workoutId: workoutId as string,
              });

              Alert.alert("Success", "Workout deleted successfully.", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              Alert.alert(
                "Error",
                error instanceof Error
                  ? error.message
                  : "Failed to delete workout"
              );
            }
          },
        },
      ]
    );
  };

  if (isLoading || !workout) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-600">Loading workout details...</Text>
      </SafeAreaView>
    );
  }

  // Calculate workout statistics
  const exerciseCount = workout.exercises?.length || 0;
  const totalSets =
    workout.exercises?.reduce(
      (acc, exercise) => acc + (exercise.sets?.length || 0),
      0
    ) || 0;

  const totalVolume =
    workout.exercises?.reduce((total, exercise) => {
      const exerciseVolume =
        exercise.sets?.reduce((setTotal, set) => {
          const weight = set.weight || 0;
          const reps = set.repetitions || 0;
          return setTotal + weight * reps;
        }, 0) || 0;
      return total + exerciseVolume;
    }, 0) || 0;

  const workoutDate = workout.date ? new Date(workout.date) : new Date();
  const fullDate = workoutDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const workoutTime = workoutDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
    >
      {/* Workout Summary Card */}
      <View className="bg-white mx-4 mt-4 mb-6 rounded-2xl p-4 border border-gray-100">
        {/* Header with Delete Button */}
        <View className="flex-row justify-between items-start mb-4">
          <Text className="text-xl font-bold text-gray-900">
            Workout Summary
          </Text>
          <TouchableOpacity
            onPress={handleDeleteWorkout}
            disabled={deleteWorkoutMutation.isPending}
            className="bg-red-500 px-3 py-2 rounded-lg flex-row items-center"
            style={{ opacity: deleteWorkoutMutation.isPending ? 0.6 : 1 }}
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color="white"
              style={{ marginRight: 4 }}
            />
            <Text className="text-white font-medium text-sm">
              {deleteWorkoutMutation.isPending ? "Deleting..." : "Delete"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date and Time */}
        <View className="flex-row items-center mb-3">
          <Ionicons
            name="calendar-outline"
            size={16}
            color="#6b7280"
            style={{ marginRight: 8 }}
          />
          <Text className="text-gray-700">
            {fullDate} at {workoutTime}
          </Text>
        </View>

        {/* Duration */}
        {workout.duration && (
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="time-outline"
              size={16}
              color="#6b7280"
              style={{ marginRight: 8 }}
            />
            <Text className="text-gray-700">
              {formatDuration(workout.duration)}
            </Text>
          </View>
        )}

        {/* Exercise Count */}
        <View className="flex-row items-center mb-3">
          <Ionicons
            name="fitness-outline"
            size={16}
            color="#6b7280"
            style={{ marginRight: 8 }}
          />
          <Text className="text-gray-700">{exerciseCount} exercises</Text>
        </View>

        {/* Total Sets */}
        <View className="flex-row items-center mb-3">
          <Ionicons
            name="list-outline"
            size={16}
            color="#6b7280"
            style={{ marginRight: 8 }}
          />
          <Text className="text-gray-700">{totalSets} total sets</Text>
        </View>

        {/* Total Volume */}
        {totalVolume > 0 && (
          <View className="flex-row items-center">
            <Ionicons
              name="barbell-outline"
              size={16}
              color="#6b7280"
              style={{ marginRight: 8 }}
            />
            <Text className="text-gray-700">
              {totalVolume.toLocaleString()} kg total volume
            </Text>
          </View>
        )}
      </View>

      {/* Exercise Cards */}
      {workout.exercises?.map((exercise, index) => (
        <ExerciseCard
          key={exercise._key}
          exercise={exercise}
          exerciseIndex={index + 1}
        />
      ))}
    </ScrollView>
  );
}
