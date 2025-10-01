import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import { formatDate, formatDuration } from "@/utils/timeUtils";

interface HistoryCardProps {
  workout: GetWorkoutsQueryResult[0];
  onPress?: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  workout,
  onPress,
}) => {
  // Calculate workout statistics
  const exerciseCount = workout.exercises?.length || 0;
  const totalSets =
    workout.exercises?.reduce(
      (acc, exercise) => acc + (exercise.sets?.length || 0),
      0
    ) || 0;

  // Get exercise names (max 3)
  const exerciseNames =
    workout.exercises
      ?.map((ex) => ex.exercise?.name)
      .filter(Boolean)
      .slice(0, 3) || [];

  const hasMoreExercises = exerciseCount > 3;
  const moreCount = exerciseCount - 3;

  // Format date for display
  const formattedDate = workout.date
    ? formatDate(workout.date)
    : "Unknown Date";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-white rounded-2xl mb-4 mx-4 p-4 relative"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {/* Header with title and date */}
      <View className="flex-row justify-between items-start mb-3 pr-6">
        <Text className="text-lg font-bold text-green-600 flex-1">
          {formattedDate}
        </Text>
      </View>

      {/* Stats badges */}
      <View className="flex-row mb-3 gap-2 flex-wrap">
        <View className="bg-green-100 px-3 py-1 rounded-full">
          <Text className="text-green-700 text-xs font-semibold">
            {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
          </Text>
        </View>
        <View className="bg-green-100 px-3 py-1 rounded-full">
          <Text className="text-green-700 text-xs font-semibold">
            {totalSets} set{totalSets !== 1 ? "s" : ""}
          </Text>
        </View>
        {workout.duration && (
          <View className="bg-green-100 px-3 py-1 rounded-full flex-row items-center">
            <Ionicons
              name="time-outline"
              size={12}
              color="#16a34a"
              style={{ marginRight: 4 }}
            />
            <Text className="text-green-700 text-xs font-semibold">
              {formatDuration(workout.duration)}
            </Text>
          </View>
        )}
      </View>

      {/* Exercise list */}
      <View className="mb-2">
        {exerciseNames.map((name, index) => (
          <Text key={index} className="text-gray-700 text-sm mb-1">
            • {name}
          </Text>
        ))}
        {hasMoreExercises && (
          <Text className="text-green-600 text-sm font-medium">
            +{moreCount} more
          </Text>
        )}
      </View>

      {/* Arrow indicator*/}
      <View className="absolute top-3 right-3">
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
};

export default HistoryCard;
