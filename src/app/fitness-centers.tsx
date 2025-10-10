import { View, Text, ActivityIndicator } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/shared/components/ui/CustomButton";
import FitnessMap from "@/modules/fitness-centers/components/FitnessMap";
import GymDetailsBottomSheet from "@/modules/fitness-centers/components/GymDetailsBottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { useLocationPermission } from "@/modules/fitness-centers/hooks/useLocationPermission";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FitnessCenter } from "@/shared/types/requests";
import { useQuery } from "@tanstack/react-query";

export default function FitnessCenters() {
  const { location, loading, error, requestLocation } = useLocationPermission();

  const { data: fitnessCenters, isLoading: centersLoading } = useQuery({
    queryKey: ["nearbyFitnessCenters", location],
    queryFn: async (): Promise<FitnessCenter[]> => {
      const apiUrl = `/api/nearest-gyms?latitude=${location.latitude}&longitude=${location.longitude}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch fitness centers");
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedGym, setSelectedGym] = useState<any>(null);

  useEffect(() => {
    if (selectedGym) {
      bottomSheetModalRef.current?.present();
    }
  }, [selectedGym]);

  const handleGymPress = (center: any) => {
    setSelectedGym(center);
  };

  const handleCloseBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
    setSelectedGym(null);
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 w-full max-w-sm">
          <View className="items-center">
            <View className="bg-red-100 rounded-full p-4 mb-4">
              <Ionicons name="location-outline" size={32} color="#ef4444" />
            </View>
            <Text className="text-gray-900 font-lexend-semibold text-lg mb-2">
              Location Required
            </Text>
            <View className="w-full space-y-3">
              <CustomButton
                title="Retry Location"
                bgVariant="primary"
                onPress={requestLocation}
              />
            </View>
          </View>
        </View>
      </View>
    );

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-100">
        {centersLoading && (
          <Text className="text-blue-600 text-center font-lexend-medium text-sm mt-2">
            Searching for nearby gyms...
          </Text>
        )}
        {fitnessCenters?.length > 0 && (
          <Text className="text-green-600 text-center font-lexend-medium text-sm mt-2">
            Found {fitnessCenters.length} fitness centers
          </Text>
        )}
      </View>

      {/* Map View */}
      {location && (
        <FitnessMap
          userLocation={location}
          fitnessCenters={fitnessCenters}
          onFitnessCenterPress={handleGymPress}
        />
      )}

      {/* Gym Details Modal */}
      <GymDetailsBottomSheet
        ref={bottomSheetModalRef}
        fitnessCenter={selectedGym}
        onClose={handleCloseBottomSheet}
      />
    </SafeAreaView>
  );
}
