import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useGetWorkouts, useDeleteWorkout } from "@/hooks/useWorkouts";
import HistoryCard from "@/components/WorkoutHistory/HistoryCard";
import HistorySkeleton from "@/components/WorkoutHistory/HistorySkeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useWorkoutStore } from "@/store/workout-store";
import { WorkoutRecord } from "@/lib/sanity/types";
import ScheduledHistoryCard from "@/components/WorkoutHistory/ScheduledHistoryCard";
import { useCalendar } from "@/hooks/useCalendar";

export default function HistoryPage() {
  const { user } = useUser();
  const router = useRouter();
  const deleteWorkoutMutation = useDeleteWorkout();
  const [activeTab, setActiveTab] = useState<"scheduled" | "completed">(
    "scheduled"
  );

  const { resetWorkout, loadWorkoutWithSets } = useWorkoutStore();

  const { deleteWorkoutEvent } = useCalendar();

  const {
    data: workouts,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useGetWorkouts(user?.id || "");

  const handleWorkoutPress = (workoutId: string) => {
    router.push({
      pathname: `/history/workout-record`,
      params: { workoutId },
    });
  };

  const handleStartScheduledWorkout = async (workout: WorkoutRecord) => {
    try {
      // Reset current workout state
      resetWorkout();

      // Load scheduled workout data into the store with sets
      if (workout.exercises && workout.exercises.length > 0) {
        const validExercises = workout.exercises.filter(
          (ex) => ex && ex.exercise
        );
        if (validExercises.length > 0) {
          loadWorkoutWithSets(validExercises as any);
        } else {
          throw new Error("No valid exercises found in scheduled workout");
        }
      } else {
        throw new Error("Scheduled workout has no exercises");
      }

      router.push("/workout");
    } catch (error) {
      console.error("Error starting scheduled workout:", error);
      Alert.alert(
        "Error",
        "Failed to load scheduled workout. Please try again."
      );
    }
  };

  const handleCancelScheduledWorkout = async (workout: WorkoutRecord) => {
    try {
      // Cancel calendar event if it exists
      const workoutWithCalendar = workout as any;
      if (workoutWithCalendar.calendarEventId) {
        try {
          await deleteWorkoutEvent(workoutWithCalendar.calendarEventId);
        } catch (calendarError) {
          console.warn("Failed to delete calendar event:", calendarError);
        }
      }

      // Delete the workout
      await deleteWorkoutMutation.mutateAsync({
        workoutId: workout._id,
      });

      Alert.alert(
        "Workout Cancelled",
        "Your scheduled workout has been cancelled and removed.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to cancel workout. Please try again.");
    }
  };

  // Separate workouts by status
  const scheduledWorkouts =
    workouts?.filter((w) => w.status === "scheduled") || [];
  const completedWorkouts =
    workouts?.filter((w) => w.status === "completed") || [];

  const currentWorkouts =
    activeTab === "scheduled" ? scheduledWorkouts : completedWorkouts;

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <ErrorState
          title="Unable to load workout history"
          message="Please check your connection and try again."
          onRetry={refetch}
          retryText="Retry"
          icon="time-outline"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="px-6 pt-4 pb-2 bg-white border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900 mb-4">
          Workout History
        </Text>

        {/* Tab Navigation */}
        <View className="flex-row bg-gray-100 rounded-lg p-1 mb-3">
          <TouchableOpacity
            onPress={() => setActiveTab("scheduled")}
            className={`flex-1 py-2 px-4 rounded-md ${
              activeTab === "scheduled" ? "bg-white" : ""
            }`}
          >
            <Text
              className={`text-center font-lexend-semibold ${
                activeTab === "scheduled" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Scheduled ({scheduledWorkouts.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("completed")}
            className={`flex-1 py-2 px-4 rounded-md ${
              activeTab === "completed" ? "bg-white" : ""
            }`}
          >
            <Text
              className={`text-center font-lexend-semibold ${
                activeTab === "completed" ? "text-green-600" : "text-gray-600"
              }`}
            >
              Completed ({completedWorkouts.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <HistorySkeleton count={4} />
      ) : currentWorkouts.length > 0 ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingVertical: 16,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={Platform.OS === "android" ? ["#22c55e"] : undefined}
              tintColor={Platform.OS === "ios" ? "#22c55e" : undefined}
              title={Platform.OS === "ios" ? "Pull to refresh" : undefined}
              titleColor={Platform.OS === "ios" ? "#6b7280" : undefined}
            />
          }
        >
          {activeTab === "scheduled"
            ? // Scheduled workouts
              scheduledWorkouts.map((workout) => (
                <ScheduledHistoryCard
                  key={workout._id}
                  workout={workout}
                  onStartNow={handleStartScheduledWorkout}
                  onCancel={handleCancelScheduledWorkout}
                />
              ))
            : // Completed workouts
              completedWorkouts.map((workout) => (
                <HistoryCard
                  key={workout._id}
                  workout={workout}
                  onPress={() => handleWorkoutPress(workout._id)}
                />
              ))}
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={Platform.OS === "android" ? ["#22c55e"] : undefined}
              tintColor={Platform.OS === "ios" ? "#22c55e" : undefined}
            />
          }
        >
          <EmptyState
            title={
              activeTab === "scheduled"
                ? "No scheduled workouts"
                : "No completed workouts"
            }
            message={
              activeTab === "scheduled"
                ? "Schedule a workout to see it here."
                : "Complete your first workout to see it here."
            }
            icon="barbell-outline"
            iconColor="#22c55e"
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
