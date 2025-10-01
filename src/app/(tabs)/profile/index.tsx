import CustomButton from "@/components/CustomButton";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useMemo } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetWorkouts } from "@/hooks/useWorkouts";

export default function Page() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { data: workouts, isLoading } = useGetWorkouts(user?.id || "");

  // Calculate workout statistics
  const workoutStats = useMemo(() => {
    if (!workouts || workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalTime: "0m 0s",
        daysActive: 0,
        averageDuration: "0m 0s",
        totalSets: 0,
        totalReps: 0,
      };
    }

    const totalWorkouts = workouts.length;
    
    // Calculate total duration in seconds
    const totalSeconds = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    const totalTime = totalHours > 0 
      ? `${totalHours}h ${remainingMinutes}m`
      : `${totalMinutes}m ${remainingSeconds}s`;

    // Calculate average duration
    const avgSeconds = totalWorkouts > 0 ? totalSeconds / totalWorkouts : 0;
    const avgMinutes = Math.floor(avgSeconds / 60);
    const avgRemainingSeconds = Math.floor(avgSeconds % 60);
    const averageDuration = `${avgMinutes}m ${avgRemainingSeconds}s`;

    // Calculate unique active days
    const uniqueDates = new Set(
      workouts.map(workout => workout.date?.split('T')[0]).filter(Boolean)
    );
    const daysActive = uniqueDates.size;

    // Calculate total sets and reps
    let totalSets = 0;
    let totalReps = 0;
    
    workouts.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        const sets = exercise.sets || [];
        totalSets += sets.length;
        totalReps += sets.reduce((sum, set) => sum + (set.repetitions || 0), 0);
      });
    });

    return {
      totalWorkouts,
      totalTime,
      daysActive,
      averageDuration,
      totalSets,
      totalReps,
    };
  }, [workouts]);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  const formatMemberSince = (createdAt: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    };
    return createdAt.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-3xl font-lexend-bold text-gray-900">Profile</Text>
          <Text className="text-gray-600 font-lexend-medium mt-1">
            Manage your account and stats
          </Text>
        </View>

        {/* User Info Card */}
        <View className="mx-4 mb-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center">
              {/* Profile Image */}
              <View className="relative">
                {user?.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center">
                    <Text className="text-white text-xl font-lexend-bold">
                      {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || 'U'}
                    </Text>
                  </View>
                )}
              </View>

              {/* User Details */}
              <View className="flex-1 ml-4">
                <Text className="text-xl font-lexend-bold text-gray-900">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName || 'User'
                  }
                </Text>
                <Text className="text-gray-600 font-lexend-medium mt-1">
                  {user?.emailAddresses?.[0]?.emailAddress || 'No email'}
                </Text>
                <Text className="text-gray-500 font-lexend-medium text-sm mt-1">
                  Member since {user?.createdAt ? formatMemberSince(user.createdAt) : 'Unknown'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fitness Stats Card */}
        <View className="mx-4 mb-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text className="text-xl font-lexend-bold text-gray-900 mb-6">
              Your Fitness Stats
            </Text>

            {isLoading ? (
              <View className="items-center py-8">
                <Text className="text-gray-500 font-lexend-medium">Loading stats...</Text>
              </View>
            ) : (
              <>
                {/* Main Stats Row */}
                <View className="flex-row justify-between mb-6">
                  {/* Total Workouts */}
                  <View className="items-center flex-1">
                    <Text className="text-3xl font-lexend-bold text-blue-600">
                      {workoutStats.totalWorkouts}
                    </Text>
                    <Text className="text-gray-600 font-lexend-medium text-sm">
                      Total{'\n'}Workouts
                    </Text>
                  </View>

                  {/* Total Time */}
                  <View className="items-center flex-1">
                    <Text className="text-3xl font-lexend-bold text-green-600">
                      {workoutStats.totalTime}
                    </Text>
                    <Text className="text-gray-600 font-lexend-medium text-sm">
                      Total{'\n'}Time
                    </Text>
                  </View>

                  {/* Days Active */}
                  <View className="items-center flex-1">
                    <Text className="text-3xl font-lexend-bold text-purple-600">
                      {workoutStats.daysActive}
                    </Text>
                    <Text className="text-gray-600 font-lexend-medium text-sm">
                      Days{'\n'}Active
                    </Text>
                  </View>
                </View>

                {/* Secondary Stats */}
                <View className="pt-4 border-t border-gray-100">
                  <View className="flex-row justify-between">
                    <View className="flex-1">
                      <Text className="text-gray-600 font-lexend-medium text-sm">
                        Average workout duration:
                      </Text>
                      <Text className="text-gray-900 font-lexend-semibold text-lg">
                        {workoutStats.averageDuration}
                      </Text>
                    </View>
                    
                    <View className="flex-row">
                      <View className="items-center mr-6">
                        <Text className="text-2xl font-lexend-bold text-orange-600">
                          {workoutStats.totalSets}
                        </Text>
                        <Text className="text-gray-600 font-lexend-medium text-xs">
                          Total Sets
                        </Text>
                      </View>
                      
                      <View className="items-center">
                        <Text className="text-2xl font-lexend-bold text-red-600">
                          {workoutStats.totalReps}
                        </Text>
                        <Text className="text-gray-600 font-lexend-medium text-xs">
                          Total Reps
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Sign Out Button */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-600 rounded-2xl p-4 shadow-sm"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="text-white font-lexend-semibold text-lg ml-2">
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
