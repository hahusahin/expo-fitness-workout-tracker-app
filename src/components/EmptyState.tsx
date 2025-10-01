import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data available",
  message = "Check back later for updates.",
  icon = "document-outline",
  iconColor = "#6b7280",
}) => {
  return (
    <View className="flex-1 justify-center items-center px-4">
      <Ionicons name={icon} size={64} color={iconColor} />
      <Text className="text-xl font-bold text-gray-900 mt-4 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-gray-600 text-center">
        {message}
      </Text>
    </View>
  );
};

export default EmptyState;