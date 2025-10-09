import React from "react";
import { View, Text, TouchableOpacity, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutRecord } from "@/lib/sanity/types";
import { formatDuration } from "@/utils/timeUtils";
import CustomButton from "@/components/CustomButton";

interface ScheduledHistoryCardProps {
  workout: WorkoutRecord;
  onStartNow: (workout: WorkoutRecord) => void;
  onCancel: (workout: WorkoutRecord) => void;
}

const ScheduledHistoryCard: React.FC<ScheduledHistoryCardProps> = ({
  workout,
  onStartNow,
  onCancel,
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

  const formatScheduledDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Workout",
      "Are you sure you want to cancel this scheduled workout?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => onCancel(workout),
        },
      ]
    );
  };

  // Choose colors based on workout timing
  const colors = {
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "text-blue-600",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
  };

  return (
    <View
      className={`${colors.bg} ${colors.border} border rounded-2xl mb-4 mx-4 p-4 relative`}
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
      {/* Status Badge */}
      <View className="absolute top-3 left-3 z-10">
        <View
          className={`${colors.badgeBg} px-2 py-1 rounded-full flex-row items-center`}
        >
          <Ionicons
            name={"calendar-outline"}
            size={12}
            color={"#2563eb"}
            style={{ marginRight: 4 }}
          />
          <Text className={`${colors.badgeText} text-xs font-semibold`}>
            {"Scheduled"}
          </Text>
        </View>
      </View>

      {/* Header with title and date */}
      <View className="flex-row justify-between items-start mb-3 mt-6 pr-6">
        <View className="flex-1">
          <Text className={`text-lg font-bold ${colors.accent} mb-1`}>
            {workout.title || "Scheduled Workout"}
          </Text>
          {(() => {
            const { date, time } = formatScheduledDateTime(workout.date);
            return (
              <Text className="text-gray-600 text-sm">
                {date} at {time}
              </Text>
            );
          })()}
        </View>
      </View>

      {/* Notes */}
      {workout.notes && (
        <View className="mb-3">
          <Text className="text-gray-600 text-sm italic">
            "{workout.notes}"
          </Text>
        </View>
      )}

      {/* Stats badges */}
      <View className="flex-row mb-3 gap-2 flex-wrap">
        <View className={`${colors.badgeBg} px-3 py-1 rounded-full`}>
          <Text className={`${colors.badgeText} text-xs font-semibold`}>
            {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
          </Text>
        </View>
        <View className={`${colors.badgeBg} px-3 py-1 rounded-full`}>
          <Text className={`${colors.badgeText} text-xs font-semibold`}>
            {totalSets} set{totalSets !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View className="flex-row gap-2 mt-2">
        <View className="flex-1">
          <CustomButton
            title="Start Now"
            bgVariant={"success"}
            textVariant={"success"}
            onPress={() => onStartNow(workout)}
            className="py-2"
            IconLeft={() => (
              <Ionicons
                name="play"
                size={16}
                color={"#16a34a"}
                style={{ marginRight: 4 }}
              />
            )}
          />
        </View>
        <View className="flex-1">
          <CustomButton
            title="Cancel"
            bgVariant="danger"
            onPress={handleCancel}
            className="py-2 border-red-200"
            IconLeft={() => (
              <Ionicons name="close" size={16} style={{ marginRight: 4 }} />
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default ScheduledHistoryCard;
