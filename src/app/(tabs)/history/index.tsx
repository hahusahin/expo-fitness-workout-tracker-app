import React from "react";
import { View, Text, ScrollView, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useGetWorkouts } from "@/hooks/useWorkouts";
import HistoryCard from "@/components/WorkoutHistory/HistoryCard";
import HistorySkeleton from "@/components/WorkoutHistory/HistorySkeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

export default function HistoryPage() {
  const { user } = useUser();
  const router = useRouter();

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

  const completedWorkoutsCount = workouts?.length || 0;

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
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Workout History
        </Text>
        <Text className="text-gray-600 text-base">
          {isLoading
            ? "Loading your workouts..."
            : `${completedWorkoutsCount} completed workout${
                completedWorkoutsCount !== 1 ? "s" : ""
              }`}
        </Text>
      </View>

      {/* Content */}
      {isLoading ? (
        <HistorySkeleton count={4} />
      ) : workouts && workouts.length > 0 ? (
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
          {workouts.map((workout) => (
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
            title="No workouts yet"
            message="Start your fitness journey by completing your first workout. Your workout history will appear here."
            icon="barbell-outline"
            iconColor="#22c55e"
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
