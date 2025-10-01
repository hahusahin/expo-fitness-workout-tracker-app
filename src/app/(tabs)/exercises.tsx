import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ExercisesList from "../../components/ExercisesList";

export default function Exercises() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header Section */}
      <View className="px-4 py-2">
        <Text className="text-3xl font-lexend-semibold text-center text-gray-900 mb-2">
          Exercises
        </Text>
        <Text className="text-gray-600 text-sm leading-5">
          Discover a variety of exercises to build your perfect workout routine.
        </Text>
      </View>

      {/* Exercises List */}
      <ExercisesList
        onExercisePress={(exercise) => router.push(`/exercise-detail?id=${exercise._id}`)}
        searchPlaceholder="Search exercise..."
        emptyTitle="No exercises available"
        emptyMessage="Check back later for new exercises."
      />
    </SafeAreaView>
  );
}
