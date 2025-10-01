import React, { useState, useMemo } from "react";
import { View, Text, FlatList, RefreshControl, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "./CustomInput";
import ExerciseCard from "./Exercises/ExerciseCard";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import ExerciseSkeleton from "./Exercises/ExerciseSkeleton";
import { useGetExercises } from "../hooks/useExercises";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";

interface ExercisesListProps {
  onExercisePress: (exercise: any) => void;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  inBottomSheet?: boolean;
}

export default function ExercisesList({
  onExercisePress,
  searchPlaceholder = "Search exercise...",
  emptyTitle = "No exercises available",
  emptyMessage = "Check back later for new exercises.",
  inBottomSheet = false,
}: ExercisesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: exercises,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useGetExercises();

  // Filter exercises based on search query
  const filteredExercises = useMemo(() => {
    if (!exercises) return [];

    if (!searchQuery.trim()) return exercises;

    const query = searchQuery.toLowerCase().trim();
    return exercises.filter(
      (exercise) =>
        exercise.name?.toLowerCase().includes(query) ||
        exercise.description?.toLowerCase().includes(query) ||
        exercise.difficulty?.toLowerCase().includes(query)
    );
  }, [exercises, searchQuery]);

  if (error) {
    return (
      <View className="flex-1">
        <ErrorState title="Unable to load exercises" onRetry={refetch} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Search Input */}
      <View className="px-4 pb-4">
        <CustomInput
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<Ionicons name="search" size={20} color="#6b7280" />}
        />
      </View>

      {/* Exercises List */}
      {isLoading ? (
        <ExerciseSkeleton />
      ) : inBottomSheet ? (
        <SafeAreaView className="flex-1" edges={["bottom"]}>
          <BottomSheetFlatList
            data={filteredExercises}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ExerciseCard
                exercise={item}
                onPress={() => onExercisePress(item)}
              />
            )}
            contentContainerClassName="px-2"
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              onPress={() => onExercisePress(item)}
            />
          )}
          contentContainerClassName="px-2"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={Platform.OS === "android" ? ["#00a727"] : undefined}
              tintColor={Platform.OS === "ios" ? "#00a727" : undefined}
              title={Platform.OS === "ios" ? "Pull to refresh" : undefined}
              titleColor={Platform.OS === "ios" ? "#6b7280" : undefined}
            />
          }
          ListEmptyComponent={
            !isLoading ? (
              <EmptyState
                title={searchQuery ? "No exercises found" : emptyTitle}
                message={
                  searchQuery
                    ? `No exercises match "${searchQuery}". Try adjusting your search.`
                    : emptyMessage
                }
                icon="fitness-outline"
              />
            ) : null
          }
        />
      )}
    </View>
  );
}
