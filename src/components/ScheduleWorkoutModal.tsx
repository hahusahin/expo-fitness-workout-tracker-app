import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";

interface ScheduleWorkoutModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSchedule: (data: {
    title: string;
    scheduledDate: Date;
    notes?: string;
  }) => void;
  isLoading?: boolean;
}

const ScheduleWorkoutModal: React.FC<ScheduleWorkoutModalProps> = ({
  isVisible,
  onClose,
  onSchedule,
  isLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Reset form when modal is closed
  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.present();
      // Reset form
      setTitle("");
      setNotes("");
      setScheduledDate(new Date());
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const newDate = new Date(scheduledDate);
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setScheduledDate(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      const newDate = new Date(scheduledDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setScheduledDate(newDate);
    }
  };

  const handleSchedule = () => {
    onSchedule({
      title: title.trim(),
      scheduledDate,
      notes: notes.trim() || undefined,
    });
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        onPress={onClose}
      />
    ),
    [onClose]
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={["75%"]}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onDismiss={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Platform.OS === "android" ? 24 : 0,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pb-6 flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-lexend-bold text-gray-900">
                Schedule Workout
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Workout Title */}
            <View className="mb-6">
              <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
                Workout Title
              </Text>
              <CustomInput
                placeholder="Enter workout title..."
                value={title}
                onChangeText={setTitle}
                containerStyle="mb-0"
              />
            </View>

            {/* Date Selection */}
            <View className="mb-6">
              <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
                Schedule Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                  <Text className="text-gray-900 font-lexend-medium ml-3">
                    {formatDate(scheduledDate)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Time Selection */}
            <View className="mb-6">
              <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
                Schedule Time
              </Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={20} color="#6b7280" />
                  <Text className="text-gray-900 font-lexend-medium ml-3">
                    {formatTime(scheduledDate)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Notes */}
            <View className="mb-6">
              <Text className="text-lg font-lexend-semibold text-gray-900 mb-3">
                Notes (Optional)
              </Text>
              <CustomInput
                placeholder="Add any notes about this workout..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                containerStyle="mb-0"
                inputStyle="h-20"
              />
            </View>

            {/* Schedule Button */}
            <CustomButton
              title="Schedule Workout"
              bgVariant="primary"
              onPress={handleSchedule}
              isLoading={isLoading}
              disabled={!title.trim() || scheduledDate <= new Date()}
              IconLeft={() => (
                <Ionicons
                  name="calendar"
                  size={20}
                  color="white"
                  style={{ marginRight: 8 }}
                />
              )}
            />
          </View>
        </BottomSheetScrollView>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={scheduledDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={scheduledDate}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
};

export default ScheduleWorkoutModal;
