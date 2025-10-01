import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ExerciseCardProps {
  exercise: {
    exercise: {
      _id: string;
      name: string | null;
    } | null;
    sets: Array<{
      repetitions?: number | null;
      reps?: number | null;
      weight: number | null;
      weightUnit: "kg" | "lbs" | null;
      _type: "set";
      _key: string;
    }> | null;
    _type: "workoutExercise";
    _key: string;
  };
  exerciseIndex: number;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  exerciseIndex,
}) => {
  const exerciseName = exercise.exercise?.name || "Unknown Exercise";
  const sets = exercise.sets || [];
  const completedSets = sets.length;

  // Calculate total volume (weight × reps for all sets)
  const totalVolume = sets.reduce((total, set) => {
    const weight = set.weight || 0;
    const reps = set.repetitions || set.reps || 0;
    return total + weight * reps;
  }, 0);

  return (
    <View className="bg-white rounded-2xl mx-4 mb-4 p-4 border border-gray-100">
      {/* Exercise Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <Text
            className="text-lg font-bold text-gray-900 flex-1"
            numberOfLines={1}
          >
            {exerciseName}
          </Text>
          <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
            <Text className="text-blue-600 font-bold text-sm">
              {exerciseIndex}
            </Text>
          </View>
        </View>
      </View>

      {/* Sets Completed Info */}
      <View className="mb-3">
        <Text className="text-gray-600 text-sm mb-2">
          {completedSets} sets completed
        </Text>
      </View>

      {/* Sets List */}
      <View className="mb-3">
        <Text className="text-gray-700 font-medium text-sm mb-2">Sets:</Text>
        {sets.map((set, index) => (
          <View
            key={set._key}
            className="flex-row justify-between items-center py-2 px-3 bg-gray-50 rounded-lg mb-1"
          >
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-gray-300 rounded-full items-center justify-center mr-3">
                <Text className="text-gray-700 font-medium text-xs">
                  {index + 1}
                </Text>
              </View>
              <Text className="text-gray-700 text-sm">
                {set.repetitions || set.reps || 0} reps
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="barbell-outline"
                size={16}
                color="#6b7280"
                style={{ marginRight: 4 }}
              />
              <Text className="text-gray-700 font-medium text-sm">
                {set.weight || 0} {set.weightUnit || "kg"}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Exercise Volume */}
      {totalVolume > 0 && (
        <View className="border-t border-gray-100 pt-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600 font-medium">Exercise Volume:</Text>
            <Text className="text-gray-900 font-bold">
              {totalVolume.toLocaleString()} kg
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ExerciseCard;
