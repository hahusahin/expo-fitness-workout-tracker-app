import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useGetWorkouts } from "@/hooks/useWorkouts";
import CustomButton from "@/components/CustomButton";
import { formatDate } from "@/utils/timeUtils";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const { data: workouts, isLoading } = useGetWorkouts(user?.id || "");

  // Get most recent workout
  const lastWorkout = workouts?.[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <View className="px-6 py-6">
          <Text className="text-lg text-gray-600 font-lexend-medium">
            {getGreeting()},
          </Text>
          <Text className="text-3xl font-lexend-bold text-gray-900">
            {user?.firstName || "User"}! 💪
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-lexend-bold text-gray-900 mb-4">
            Quick Actions
          </Text>

          {/* Secondary Actions */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => router.push("/history")}
              className="flex-1 bg-white rounded-xl p-4 mr-2 shadow-sm border border-gray-100"
            >
              <View className="items-center">
                <View className="bg-gray-100 rounded-full p-3 mb-2">
                  <Ionicons name="time-outline" size={24} color="#6b7280" />
                </View>
                <Text className="text-gray-900 font-lexend-semibold text-sm">
                  Workout
                </Text>
                <Text className="text-gray-900 font-lexend-semibold text-sm">
                  History
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/exercises")}
              className="flex-1 bg-white rounded-xl p-4 ml-2 shadow-sm border border-gray-100"
            >
              <View className="items-center">
                <View className="bg-gray-100 rounded-full p-3 mb-2">
                  <Ionicons name="fitness-outline" size={24} color="#6b7280" />
                </View>
                <Text className="text-gray-900 font-lexend-semibold text-sm">
                  Browse
                </Text>
                <Text className="text-gray-900 font-lexend-semibold text-sm">
                  Exercises
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Last Workout */}
        {lastWorkout && (
          <View className="mx-6 mb-6">
            <Text className="text-lg font-lexend-bold text-gray-900 mb-4">
              Last Workout
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/history/workout-record`,
                  params: { workoutId: lastWorkout._id },
                })
              }
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-lg font-lexend-bold text-gray-900">
                      {lastWorkout.date
                        ? formatDate(lastWorkout.date)
                        : "Recent"}
                    </Text>
                    <View className="bg-blue-100 rounded-full p-1 ml-2">
                      <Ionicons name="heart" size={16} color="#3b82f6" />
                    </View>
                  </View>

                  <View className="flex-row items-center text-gray-600">
                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                    <Text className="text-gray-600 font-lexend-medium ml-1">
                      {Math.floor((lastWorkout.duration || 0) / 60)}m{" "}
                      {(lastWorkout.duration || 0) % 60}s
                    </Text>
                  </View>

                  <Text className="text-gray-600 font-lexend-medium mt-1">
                    {lastWorkout.exercises?.length || 0} exercises •{" "}
                    {lastWorkout.exercises?.reduce(
                      (total, exercise) => total + (exercise.sets?.length || 0),
                      0
                    ) || 0}{" "}
                    sets
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </View>
            </TouchableOpacity>

            {/* Start Workout Button */}
            <View className="mt-6">
              <CustomButton
                title="Start Workout"
                bgVariant="primary"
                onPress={() => router.push("/workout")}
                IconLeft={() => (
                  <Ionicons
                    name="play"
                    size={20}
                    color="white"
                    className="mr-2"
                  />
                )}
                className="bg-blue-500"
              />
            </View>
          </View>
        )}

        {/* Empty State for No Workouts */}
        {!isLoading && (!workouts || workouts.length === 0) && (
          <View className="mx-6 mb-6">
            <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center">
              <View className="bg-blue-100 rounded-full p-4 mb-4">
                <Ionicons name="fitness-outline" size={32} color="#3b82f6" />
              </View>
              <Text className="text-xl font-lexend-bold text-gray-900 mb-2">
                Ready to Start?
              </Text>
              <Text className="text-gray-600 font-lexend-medium text-center mb-4">
                Begin your fitness journey by starting your first workout
                session.
              </Text>
              <CustomButton
                title="Start Your First Workout"
                bgVariant="primary"
                onPress={() => router.push("/workout")}
                className="w-full"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
