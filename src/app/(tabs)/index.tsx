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
import { useNotification } from "@/providers/NotificationProvider";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const { data: workouts, isLoading } = useGetWorkouts(user?.id || "");

  // example of passing notification data to screen
  const { expoPushToken, notification } = useNotification();

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

        {/* Just a view for displaying Notification data when it comes to app */}
        {notification && (
          <View className="mx-6 mb-6">
            <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center">
              <View className="bg-green-100 rounded-full p-4 mb-4">
                <Ionicons
                  name="notifications-outline"
                  size={32}
                  color="#10b981"
                />
              </View>
              <Text className="font-lexend-semibold text-red-500">
                Latest notification:
              </Text>
              <Text className="text-gray-600 font-lexend-medium text-center mb-4">
                {notification?.request?.content?.title}
              </Text>
              <Text className="text-gray-600 font-lexend-medium text-center mb-4">
                {JSON.stringify(notification?.request?.content?.data, null, 2)}
              </Text>
            </View>
          </View>
        )}

        {/* Fitness Centers Quick Access */}
        <View className="mx-6 mb-6">
          <TouchableOpacity
            onPress={() => router.push("/fitness-centers")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 shadow-sm"
            style={{
              backgroundColor: "#3b82f6", // Fallback for gradient
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white font-lexend-bold text-lg mb-1">
                  🏋️ Find Nearby Gyms
                </Text>
                <Text className="text-blue-100 font-lexend-medium">
                  Discover fitness centers near you
                </Text>
              </View>
              <View className="bg-white/20 rounded-full p-2">
                <Ionicons name="location-outline" size={24} color="white" />
              </View>
            </View>
          </TouchableOpacity>
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
