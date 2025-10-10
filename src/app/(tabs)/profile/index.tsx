import CustomButton from "@/shared/components/ui/CustomButton";
import ProfileAvatar from "@/modules/profile/components/ProfileAvatar";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetWorkouts } from "@/modules/workouts/hooks/useWorkouts";
import { usePhotoPicker } from "@/modules/profile/hooks/usePhotoPicker";
import { useMutation } from "@tanstack/react-query";

export default function Page() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { data: workouts, isLoading } = useGetWorkouts(user?.id || "");

  // Clerk profile photo upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      if (!user) throw new Error("User not found");

      // Get file extension from URI
      const fileExtension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
      const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";

      // Create file object
      const file = {
        uri: imageUri,
        type: mimeType,
        name: `profile.${fileExtension}`,
      } as any;

      // Upload using Clerk's setProfileImage method
      // Reload user data to get updated image
      await user.setProfileImage({ file });
      await user.reload();
    },
    onSuccess: () => {
      Alert.alert("Success", "Profile photo updated successfully!");
      clearPhoto(); // Clear the selected photo after successful upload
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to update profile photo";
      Alert.alert("Error", errorMessage);
    },
  });

  const { selectImageSource, selectedPhoto, isSelecting, clearPhoto } =
    usePhotoPicker({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

  const isUploading = uploadMutation.isPending;
  const hasSelectedPhoto = !!selectedPhoto;

  // Handle upload button press
  const handleUploadPhoto = () => {
    if (selectedPhoto) {
      uploadMutation.mutate(selectedPhoto);
    }
  };

  // Handle cancel/clear selected photo
  const handleCancelPhoto = () => {
    clearPhoto();
  };

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
    const totalSeconds = workouts.reduce(
      (sum, workout) => sum + (workout.duration || 0),
      0
    );
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    const totalTime =
      totalHours > 0
        ? `${totalHours}h ${remainingMinutes}m`
        : `${totalMinutes}m ${remainingSeconds}s`;

    // Calculate average duration
    const avgSeconds = totalWorkouts > 0 ? totalSeconds / totalWorkouts : 0;
    const avgMinutes = Math.floor(avgSeconds / 60);
    const avgRemainingSeconds = Math.floor(avgSeconds % 60);
    const averageDuration = `${avgMinutes}m ${avgRemainingSeconds}s`;

    // Calculate unique active days
    const uniqueDates = new Set(
      workouts.map((workout) => workout.date?.split("T")[0]).filter(Boolean)
    );
    const daysActive = uniqueDates.size;

    // Calculate total sets and reps
    let totalSets = 0;
    let totalReps = 0;

    workouts.forEach((workout) => {
      workout.exercises?.forEach((exercise) => {
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
      year: "numeric",
      month: "long",
    };
    return createdAt.toLocaleDateString("en-US", options);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-3xl font-lexend-bold text-gray-900">
            Profile
          </Text>
          <Text className="text-gray-600 font-lexend-medium mt-1">
            Manage your account and stats
          </Text>
        </View>

        {/* User Info Card */}
        <View className="mx-4 mb-6">
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center">
              {/* Profile Avatar with Upload */}
              <ProfileAvatar
                imageUrl={hasSelectedPhoto ? selectedPhoto : user?.imageUrl}
                firstName={user?.firstName}
                email={user?.emailAddresses?.[0]?.emailAddress}
                size="large"
                onPress={selectImageSource}
                isUploading={isSelecting}
                showEditIcon={!hasSelectedPhoto}
              />

              {/* User Details */}
              <View className="flex-1 ml-4">
                <Text className="text-xl font-lexend-bold text-gray-900">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName || "User"}
                </Text>
                <Text className="text-gray-600 font-lexend-medium mt-1">
                  {user?.emailAddresses?.[0]?.emailAddress || "No email"}
                </Text>
                <Text className="text-gray-500 font-lexend-medium text-sm mt-1">
                  Member since{" "}
                  {user?.createdAt
                    ? formatMemberSince(user.createdAt)
                    : "Unknown"}
                </Text>

                {/* Photo Upload/Cancel Buttons */}
                {hasSelectedPhoto ? (
                  <View className="mt-2 flex-row gap-2">
                    <TouchableOpacity
                      onPress={handleUploadPhoto}
                      disabled={isUploading}
                      className="flex-1"
                    >
                      <View className="flex-row items-center justify-center bg-green-50 px-3 py-1.5 rounded-lg">
                        <Ionicons
                          name="cloud-upload-outline"
                          size={14}
                          color="#16A34A"
                        />
                        <Text className="text-green-600 font-lexend-medium text-sm ml-1">
                          {isUploading ? "Uploading..." : "Upload"}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleCancelPhoto}
                      disabled={isUploading}
                      className="flex-1"
                    >
                      <View className="flex-row items-center justify-center bg-red-50 px-3 py-1.5 rounded-lg">
                        <Ionicons
                          name="close-outline"
                          size={14}
                          color="#DC2626"
                        />
                        <Text className="text-red-600 font-lexend-medium text-sm ml-1">
                          Cancel
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={selectImageSource}
                    disabled={isUploading}
                    className="mt-2 self-start"
                  >
                    <View className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-lg">
                      <Ionicons
                        name="camera-outline"
                        size={14}
                        color="#3B82F6"
                      />
                      <Text className="text-blue-600 font-lexend-medium text-sm ml-1">
                        {isSelecting ? "Selecting..." : "Choose Photo"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
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
                <Text className="text-gray-500 font-lexend-medium">
                  Loading stats...
                </Text>
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
                      Total{"\n"}Workouts
                    </Text>
                  </View>

                  {/* Total Time */}
                  <View className="items-center flex-1">
                    <Text className="text-3xl font-lexend-bold text-green-600">
                      {workoutStats.totalTime}
                    </Text>
                    <Text className="text-gray-600 font-lexend-medium text-sm">
                      Total{"\n"}Time
                    </Text>
                  </View>

                  {/* Days Active */}
                  <View className="items-center flex-1">
                    <Text className="text-3xl font-lexend-bold text-purple-600">
                      {workoutStats.daysActive}
                    </Text>
                    <Text className="text-gray-600 font-lexend-medium text-sm">
                      Days{"\n"}Active
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
