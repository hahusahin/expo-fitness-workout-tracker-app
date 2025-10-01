import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutExercise } from "@/store/workout-store";

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  onPress: () => void;
  onDelete: () => void;
}

export default function ExerciseCard({
  exercise,
  onPress,
  onDelete,
}: ExerciseCardProps) {
  const completedSets = exercise.sets.filter((set) => set.isCompleted).length;
  const totalSets = exercise.sets.length;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 mx-2 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-lexend-semibold text-gray-900 mb-1">
            {exercise.name}
          </Text>
          <View className="flex-row items-center">
            <View className="bg-blue-100 rounded-full px-3 py-1 mr-2">
              <Text className="text-blue-700 text-sm font-lexend-medium">
                {completedSets}/{totalSets} sets
              </Text>
            </View>
            {completedSets === totalSets && totalSets > 0 && (
              <View className="bg-green-100 rounded-full px-3 py-1">
                <Text className="text-green-700 text-sm font-lexend-medium">
                  Complete
                </Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={onDelete}
          className="bg-red-100 rounded-full p-2 ml-3"
        >
          <Ionicons name="trash-outline" size={20} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}