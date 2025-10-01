import { useRouter, useLocalSearchParams } from "expo-router";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
  Linking,
  ScrollView,
} from "react-native";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import Markdown from "react-native-markdown-display";

import { useGetSingleExercise } from "@/hooks/useExercises";
import ErrorState from "@/components/ErrorState";
import {
  getDifficultyColorClass,
  getDifficultyBgColor,
} from "@/utils/difficultyUtils";
import { urlFor } from "@/lib/sanity/client";
import { Ionicons } from "@expo/vector-icons";
import { fetchAIGuidance } from "@/hooks/useAIGuaidance";
import { useMutation } from "@tanstack/react-query";

export default function ExerciseDetailModal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const exerciseId = typeof id === "string" ? id : id?.[0] || "";

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const snapPoints = useMemo(() => ["75%"], []);

  // Hooks
  const { data: exercise, isLoading } = useGetSingleExercise(exerciseId);
  const aiGuidanceMutation = useMutation({
    mutationFn: fetchAIGuidance,
  });

  const imageUri = exercise?.image?.asset ? urlFor(exercise.image).url() : null;

  // AI Guidance state
  const handleGetAIGuidance = useCallback(() => {
    if (exercise?.name) {
      aiGuidanceMutation.mutate(exercise.name);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [exercise?.name, aiGuidanceMutation]);

  // Present modal when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      bottomSheetRef.current?.present();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        setTimeout(() => {
          router.back();
        }, 100);
      }
    },
    [router]
  );

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const backdropComponent = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={backdropComponent}
      backgroundStyle={{ backgroundColor: "#ebecf0" }}
    >
      <BottomSheetScrollView ref={scrollViewRef}>
        {isLoading ? (
          <View className="flex-1 justify-center items-center px-6">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-600 text-base mt-4">
              Loading exercise details...
            </Text>
          </View>
        ) : exercise ? (
          <View className="flex-1 pb-6">
            {/* Close Button - Absolute positioned */}
            <Pressable
              onPress={handleClose}
              className="absolute top-0 right-4 z-10 bg-black/20 rounded-full p-2"
            >
              <Ionicons name="close" size={18} color="white" />
            </Pressable>

            {/* Content Container */}
            <View className="px-6">
              {/* Exercise Image - Full width at the top */}
              <View className="mb-0">
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-72"
                    resizeMode="contain"
                  />
                ) : (
                  <View className="w-full h-64 bg-gray-200 justify-center items-center">
                    <Ionicons name="image-outline" size={48} color="#9ca3af" />
                    <Text className="text-gray-500 mt-2">
                      No image available
                    </Text>
                  </View>
                )}
              </View>
              {/* Title and Difficulty - Side by side */}
              <View className="flex-row items-center justify-between mb-4 mt-6">
                <Text className="text-gray-900 text-2xl font-bold flex-1 mr-3">
                  {exercise.name}
                </Text>

                <View
                  className={`px-3 py-1 rounded-full ${getDifficultyBgColor(
                    exercise.difficulty
                  )}`}
                >
                  <Text
                    className={`text-sm font-semibold ${getDifficultyColorClass(
                      exercise.difficulty
                    )}`}
                  >
                    {exercise.difficulty
                      ? exercise.difficulty.charAt(0).toUpperCase() +
                        exercise.difficulty.slice(1).toLowerCase()
                      : ""}
                  </Text>
                </View>
              </View>

              {/* Description */}
              {exercise.description && (
                <View className="mb-6">
                  <Text className="text-gray-700 text-base leading-6">
                    {exercise.description}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View className="gap-3 mb-6">
                {/* Watch Video Button */}
                {exercise.videoUrl && (
                  <Pressable
                    className="bg-white border border-gray-300 rounded-xl p-4 flex-row items-center justify-center"
                    onPress={() => Linking.openURL(exercise.videoUrl)}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Ionicons name="play" size={20} color="#374151" />
                    <Text className="text-gray-700 font-semibold ml-2">
                      Watch Video
                    </Text>
                  </Pressable>
                )}

                {/* AI Guidance Content */}
                {(aiGuidanceMutation.data || aiGuidanceMutation.isPending) && (
                  <View className="mb-6">
                    <View className="flex-row items-center mb-6">
                      <Ionicons name="fitness" size={24} color="#3B82F6" />
                      <Text className="text-xl font-semibold 	text-gray-800 ml-2">
                        AI Coach says...
                      </Text>
                    </View>
                    {aiGuidanceMutation.isPending ? (
                      <View className="bg-gray-50 rounded-xl p-4 items-center">
                        <ActivityIndicator size="small" color="#3B82F6" />
                        <Text className="text-gray-600 mt-2">
                          Getting personalized guidance...
                        </Text>
                      </View>
                    ) : aiGuidanceMutation.data ? (
                      <View className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                        <Markdown
                          style={{
                            body: {
                              paddingBottom: 20,
                            },
                            heading2: {
                              fontSize: 18,
                              fontWeight: "bold",
                              color: "#1f2937",
                              marginTop: 12,
                              marginBottom: 6,
                            },
                            heading3: {
                              fontSize: 16,
                              fontWeight: "600",
                              color: "#374151",
                              marginTop: 8,
                              marginBottom: 4,
                            },
                          }}
                        >
                          {aiGuidanceMutation.data}
                        </Markdown>
                      </View>
                    ) : aiGuidanceMutation.isError ? (
                      <View className="bg-red-50 rounded-xl p-4 border-l-4 border-red-500">
                        <Text className="text-red-700">
                          Failed to get AI guidance. Please try again.
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )}

                {/* Start AI Guidance Button */}
                <Pressable
                  onPress={handleGetAIGuidance}
                  disabled={aiGuidanceMutation.isPending}
                  className={`${
                    aiGuidanceMutation.isPending
                      ? "bg-gray-400"
                      : "bg-green-500"
                  } rounded-xl p-4 flex-row items-center justify-center`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  {aiGuidanceMutation.isPending ? (
                    <ActivityIndicator size={20} color="white" />
                  ) : (
                    <Ionicons name="fitness" size={20} color="white" />
                  )}
                  <Text className="text-white font-semibold ml-2">
                    {aiGuidanceMutation.isPending
                      ? "Getting Guidance..."
                      : "Start AI Guidance"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center px-6">
            <ErrorState />
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
