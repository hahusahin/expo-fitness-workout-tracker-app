import React, { forwardRef, useMemo } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import { FitnessCenter } from "@/types/requests";

interface GymDetailsBottomSheetProps {
  fitnessCenter: FitnessCenter | null;
  onClose: () => void;
}

const GymDetailsBottomSheet = forwardRef<
  BottomSheetModal,
  GymDetailsBottomSheetProps
>(({ fitnessCenter, onClose }, ref) => {
  const snapPoints = useMemo(() => ["50%", "75%"], []);

  const handleGetDirections = async () => {
    if (!fitnessCenter) return;

    const { latitude, longitude } = fitnessCenter.location;

    try {
      if (Platform.OS === 'android') {
        // Use Google Maps navigation URL for direct opening on Android
        const googleMapsUrl = `google.navigation:q=${latitude},${longitude}`;
        const isSupported = await Linking.canOpenURL(googleMapsUrl);
        
        if (isSupported) {
          await Linking.openURL(googleMapsUrl);
          return;
        }
        
        // Fallback to intent URL for Android
        const intentUrl = `intent://maps.google.com/maps?daddr=${latitude},${longitude}#Intent;scheme=https;package=com.google.android.apps.maps;end`;
        const intentSupported = await Linking.canOpenURL(intentUrl);
        
        if (intentSupported) {
          await Linking.openURL(intentUrl);
          return;
        }
      } else {
        // iOS - try Google Maps app first
        const googleMapsUrl = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`;
        const isSupported = await Linking.canOpenURL(googleMapsUrl);
        
        if (isSupported) {
          await Linking.openURL(googleMapsUrl);
          return;
        }
        
        // Fallback to Apple Maps on iOS
        const appleMapsUrl = `maps://app?daddr=${latitude},${longitude}`;
        await Linking.openURL(appleMapsUrl);
        return;
      }
      
      // Final fallback to web version
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      await Linking.openURL(webUrl);
    } catch (error) {
      console.error('Error opening maps:', error);
      // Final fallback
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(webUrl);
    }
  };

  const handleCallPhone = async () => {
    if (!fitnessCenter?.phoneNumber) return;

    try {
      const phoneUrl = `tel:${fitnessCenter.phoneNumber}`;
      const isSupported = await Linking.canOpenURL(phoneUrl);
      
      if (isSupported) {
        await Linking.openURL(phoneUrl);
      } else {
        console.error('Phone calling not supported on this device');
      }
    } catch (error) {
      console.error('Error opening phone app:', error);
    }
  };

  const handleVisitWebsite = async () => {
    if (!fitnessCenter?.website) return;

    try {
      const isSupported = await Linking.canOpenURL(fitnessCenter.website);
      
      if (isSupported) {
        await Linking.openURL(fitnessCenter.website);
      } else {
        console.error('Cannot open website URL');
      }
    } catch (error) {
      console.error('Error opening website:', error);
    }
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      onPress={onClose}
    />
  );

  if (!fitnessCenter) return null;

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onClose}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#d1d5db" }}
      backgroundStyle={{ backgroundColor: "white" }}
    >
      <BottomSheetView
        style={{
          flex: 1,
          padding: 16,
          paddingBottom: Platform.OS === "ios" ? 0 : 42,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-xl font-lexend-bold text-gray-900">
              {fitnessCenter.name}
            </Text>
            {fitnessCenter.rating && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text className="text-gray-600 font-lexend-medium ml-1">
                  {fitnessCenter.rating.toFixed(1)} rating
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="bg-gray-100 rounded-full p-2"
          >
            <Ionicons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Address */}
        <View className="flex-row items-start mb-4">
          <Ionicons name="location-outline" size={20} color="#6b7280" />
          <Text className="text-gray-600 font-lexend-medium ml-2 flex-1">
            {fitnessCenter.address}
          </Text>
        </View>

        {/* Status */}
        {fitnessCenter.openNow !== undefined && (
          <View className="flex-row items-center mb-4">
            <View
              className={`w-3 h-3 rounded-full mr-2 ${
                fitnessCenter.openNow ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <Text
              className={`font-lexend-medium ${
                fitnessCenter.openNow ? "text-green-600" : "text-red-600"
              }`}
            >
              {fitnessCenter.openNow ? "Open now" : "Closed"}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="gap-3">
          <CustomButton
            title="Get Directions"
            bgVariant="primary"
            onPress={handleGetDirections}
            IconLeft={() => (
              <Ionicons name="navigate-outline" size={20} color="white" />
            )}
          />

          <View className="flex-row gap-3">
            {fitnessCenter.phoneNumber && (
              <View className="flex-1">
                <CustomButton
                  title="Call"
                  bgVariant="outline"
                  textVariant="primary"
                  onPress={handleCallPhone}
                  IconLeft={() => (
                    <Ionicons name="call-outline" size={18} color="#3b82f6" />
                  )}
                />
              </View>
            )}

            {fitnessCenter.website && (
              <View className="flex-1">
                <CustomButton
                  title="Website"
                  bgVariant="outline"
                  textVariant="primary"
                  onPress={handleVisitWebsite}
                  IconLeft={() => (
                    <Ionicons name="globe-outline" size={18} color="#3b82f6" />
                  )}
                />
              </View>
            )}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

GymDetailsBottomSheet.displayName = "GymDetailsBottomSheet";

export default GymDetailsBottomSheet;
