import React from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { Exercise } from "../../lib/sanity/types";
import { urlFor } from "../../lib/sanity/client";
import { getDifficultyColorClass } from "../../utils/difficultyUtils";

interface ExerciseCardProps {
  exercise: Exercise;
  showIndicator?: boolean;
  onPress?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  showIndicator = true,
  onPress,
}) => {
  const imageUri = exercise.image?.asset ? urlFor(exercise.image).url() : null;
  const difficultyColorClass = getDifficultyColorClass(exercise.difficulty);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-white rounded-2xl mb-4 mx-1 overflow-hidden flex-row"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      {/* Exercise Image - Left Side */}
      <View className="w-32 h-32 bg-gray-200 rounded-l-2xl overflow-hidden">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gray-300 justify-center items-center">
            <Text className="text-gray-500 text-xs text-center">No Image</Text>
          </View>
        )}
      </View>

      {/* Content Section - Right Side */}
      <View className="flex-1 p-4 justify-center">
        {/* Difficulty Text */}
        <Text
          className={`text-xs font-semibold uppercase tracking-wide mb-1 ${difficultyColorClass}`}
        >
          {exercise.difficulty?.toUpperCase()}
        </Text>

        {/* Exercise Name */}
        <Text
          className="text-lg font-bold text-gray-900 mb-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {exercise.name || "Unnamed Exercise"}
        </Text>

        {/* Exercise Description */}
        <Text
          className="text-gray-600 text-sm leading-4"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {exercise.description || "No description available."}
        </Text>
      </View>

      {/* Detail Indicator - Absolute positioned on the right */}
      {showIndicator && (
        <View className="absolute top-3 right-3">
          <View className="bg-white bg-opacity-90 rounded-full p-1">
            <Text className="text-gray-700 text-lg font-bold">›</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ExerciseCard;
