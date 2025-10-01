import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "Unable to load data. Please check your connection and try again.",
  onRetry,
  retryText = "Tap to retry",
  icon = "alert-circle-outline",
}) => {
  return (
    <View className="flex-1 justify-center items-center px-4">
      <Ionicons name={icon} size={64} color="#ef4444" />
      <Text className="text-xl font-bold text-gray-900 mt-4 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-blue-500 px-6 py-3 rounded-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorState;