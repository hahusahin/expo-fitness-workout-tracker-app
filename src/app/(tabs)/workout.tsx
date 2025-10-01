import {
  View,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useRef, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { useStopwatch } from "react-timer-hook";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWorkoutStore } from "@/store/workout-store";
import CustomButton from "@/components/CustomButton";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import ActiveWorkoutExerciseCard from "@/components/ActiveWorkout/ExerciseCard";
import WorkoutSetCard from "@/components/ActiveWorkout/WorkoutSetCard";
import ExercisesList from "@/components/ExercisesList";
import { useSaveWorkout } from "@/hooks/useWorkouts";
import { WorkoutPayload } from "@/types/requests";

export default function ActiveWorkout() {
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const saveWorkoutMutation = useSaveWorkout();

  const { seconds, minutes, hours, totalSeconds, reset, pause, start } =
    useStopwatch({
      autoStart: false,
    });

  const {
    workoutExercises,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    addSetToExercise,
    removeSetFromExercise,
    updateSet,
    toggleSetCompletion,
    weightUnit,
    setWeightUnit,
    workoutStarted,
    setWorkoutStarted,
    resetWorkout,
  } = useWorkoutStore();

  const snapPoints = useMemo(() => ["75%"], []);

  const formatTime = (time: number) => {
    return time.toString().padStart(2, "0");
  };

  const handleEndWorkout = () => {
    Alert.alert(
      "Reset Workout",
      "Are you sure you want to reset this workout? All progress will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset Workout",
          style: "destructive",
          onPress: () => {
            reset(undefined, false);
            resetWorkout();
          },
        },
      ]
    );
  };

  const handleStartWorkout = () => {
    setWorkoutStarted(true);
    start();
  };

  const handleWeightUnitChange = (unit: "kg" | "lbs") => {
    setWeightUnit(unit);
  };

  const handleAddExercise = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleExerciseSelect = (exercise: any) => {
    addExerciseToWorkout({
      name: exercise.name,
      sanityId: exercise._id,
    });
    bottomSheetModalRef.current?.dismiss();
  };

  const handleExercisePress = (exercise: any) => {
    router.push(`/exercise-detail?id=${exercise.sanityId}`);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    Alert.alert(
      "Remove Exercise",
      "Are you sure you want to remove this exercise?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeExerciseFromWorkout(exerciseId),
        },
      ]
    );
  };

  const saveWorkout = async () => {
    if (!user?.id) return;

    try {
      const workoutPayload: WorkoutPayload = {
        _type: "workout",
        userId: user.id,
        date: new Date().toISOString(),
        duration: totalSeconds,
        exercises: workoutExercises.map((exercise) => ({
          _type: "workoutExercise",
          _key: exercise.id,
          exercise: {
            _type: "reference",
            _ref: exercise.sanityId,
          },
          sets: exercise.sets
            .filter((set) => set.reps && set.weight) // Only include sets with data
            .map((set) => ({
              _type: "set",
              _key: set.id,
              repetitions: parseInt(set.reps) || 0,
              weight: parseFloat(set.weight) || 0,
              weightUnit: set.weightUnit,
            })),
        })),
      };

      await saveWorkoutMutation.mutateAsync({ workoutPayload });

      Alert.alert(
        "Workout Saved!",
        "Your workout has been saved successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              reset(undefined, false);
              resetWorkout();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save workout. Please try again.");
    }
  };

  // Check if all sets are completed
  const allSetsCompleted =
    workoutExercises.length > 0 &&
    workoutExercises.every(
      (exercise) =>
        exercise.sets.length > 0 &&
        exercise.sets.every((set) => set.isCompleted)
    );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />

      {/* Custom Header with Dark Background */}
      <View
        className="bg-gray-800"
        style={{
          paddingTop: Platform.OS === "ios" ? insets.top : insets.top + 10,
          paddingBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        {/* Header Title */}
        <Text className="text-white text-lg font-lexend-bold text-center mb-3">
          Active Workout
        </Text>

        <View className="flex-row items-center justify-between">
          {/* Timer */}
          <View className="flex-1">
            <Text className="text-gray-300 text-xs font-lexend-medium">
              Duration
            </Text>
            <Text className="text-white text-xl font-lexend-bold">
              {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
            </Text>
          </View>

          {/* Weight Unit Selector */}
          <View className="flex-row bg-gray-700 rounded-full p-1 mx-3">
            <TouchableOpacity
              onPress={() => handleWeightUnitChange("kg")}
              className={`px-3 py-1 rounded-full ${
                weightUnit === "kg" ? "bg-blue-500" : "bg-transparent"
              }`}
            >
              <Text
                className={`font-lexend-semibold text-sm ${
                  weightUnit === "kg" ? "text-white" : "text-gray-300"
                }`}
              >
                kg
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleWeightUnitChange("lbs")}
              className={`px-3 py-1 rounded-full ${
                weightUnit === "lbs" ? "bg-blue-500" : "bg-transparent"
              }`}
            >
              <Text
                className={`font-lexend-semibold text-sm ${
                  weightUnit === "lbs" ? "text-white" : "text-gray-300"
                }`}
              >
                lbs
              </Text>
            </TouchableOpacity>
          </View>

          {/* End Workout Button */}
          <View className="flex-1">
            <CustomButton
              title="Reset"
              bgVariant="danger"
              textVariant="danger"
              onPress={handleEndWorkout}
              className="py-1 px-4"
              disabled={!workoutStarted}
            />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Selected Exercises */}
          {workoutExercises.length > 0 ? (
            <View className="pt-4">
              {workoutExercises.map((exercise) => (
                <View key={exercise.id} className="mb-6">
                  {/* Exercise Card */}
                  <ActiveWorkoutExerciseCard
                    exercise={exercise}
                    onPress={() => handleExercisePress(exercise)}
                    onDelete={() => handleRemoveExercise(exercise.id)}
                  />

                  {/* Sets Section */}
                  <View className="px-4">
                    {exercise.sets.length > 0 ? (
                      exercise.sets.map((set, setIndex) => (
                        <WorkoutSetCard
                          key={set.id}
                          set={set}
                          setIndex={setIndex}
                          onUpdateReps={(reps) =>
                            updateSet(exercise.id, set.id, { reps })
                          }
                          onUpdateWeight={(weight) =>
                            updateSet(exercise.id, set.id, { weight })
                          }
                          onToggleComplete={() =>
                            toggleSetCompletion(exercise.id, set.id)
                          }
                          onDelete={() =>
                            removeSetFromExercise(exercise.id, set.id)
                          }
                          weightUnit={weightUnit}
                          workoutStarted={workoutStarted}
                        />
                      ))
                    ) : (
                      <View className="bg-gray-50 rounded-lg p-4 mb-3">
                        <Text className="text-gray-600 text-center font-lexend-medium">
                          No sets added yet. Tap "Add Set" to get started.
                        </Text>
                      </View>
                    )}

                    {/* Add Set Button */}
                    <TouchableOpacity
                      onPress={() => addSetToExercise(exercise.id)}
                      className="bg-blue-100 rounded-lg p-3 mb-2 flex-row items-center justify-center"
                    >
                      <Ionicons name="add" size={20} color="#3b82f6" />
                      <Text className="text-blue-600 font-lexend-semibold ml-2">
                        Add Set
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="flex-1 justify-center items-center p-8">
              <Ionicons name="fitness-outline" size={64} color="#9ca3af" />
              <Text className="text-3xl font-lexend-semibold text-gray-900 mt-4 mb-2">
                Ready to Train?
              </Text>
              <Text className="text-gray-600 text-center text-lg font-lexend mb-6">
                Add exercises to your workout to get started.
              </Text>
            </View>
          )}

          {/* Add Exercise Button */}
          <View className="p-4">
            <CustomButton
              title="Add Exercise"
              bgVariant="outline"
              textVariant="primary"
              onPress={handleAddExercise}
              IconLeft={() => (
                <Ionicons
                  name="add"
                  size={20}
                  color="#0286FF"
                  className="mr-2"
                />
              )}
            />
          </View>

          {/* Start/Complete Workout Button */}
          <View className="p-4">
            {!workoutStarted ? (
              <CustomButton
                title="Start Workout"
                bgVariant="success"
                onPress={handleStartWorkout}
                disabled={workoutExercises.length === 0}
              />
            ) : (
              <CustomButton
                title="Complete Workout"
                bgVariant="success"
                onPress={saveWorkout}
                isLoading={saveWorkoutMutation.isPending}
                disabled={!allSetsCompleted}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Exercise Selection Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        enableDynamicSizing={false}
      >
        <View className="px-4 pb-2">
          <Text className="text-xl font-lexend-bold text-center mb-4">
            Select Exercise
          </Text>
        </View>
        <ExercisesList
          onExercisePress={handleExerciseSelect}
          searchPlaceholder="Search exercises to add..."
          emptyTitle="No exercises found"
          emptyMessage="Try adjusting your search or check back later."
          inBottomSheet={true}
        />
      </BottomSheetModal>
    </View>
  );
}
