import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const usePhotoPicker = (
  options: ImagePicker.ImagePickerOptions = {}
) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectImageSource = () => {
    Alert.alert("Select Photo", "Choose how you want to select your photo", [
      {
        text: "Camera",
        onPress: () => openCamera(),
      },
      {
        text: "Photo Gallery",
        onPress: () => openImagePicker(),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const openCamera = async () => {
    try {
      setIsSelecting(true);
      setError(null);

      // Request camera permissions
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to take a photo.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Settings",
              onPress: () => ImagePicker.requestCameraPermissionsAsync(),
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync(options);

      if (!result.canceled && result.assets[0]) {
        setSelectedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      const errorMessage = "Failed to open camera";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSelecting(false);
    }
  };

  const openImagePicker = async () => {
    try {
      setIsSelecting(true);
      setError(null);

      // Request media library permissions
      const mediaLibraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (mediaLibraryPermission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Photo library permission is required to select a photo.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Settings",
              onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets[0]) {
        setSelectedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      const errorMessage = "Failed to open photo library";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSelecting(false);
    }
  };

  const clearPhoto = () => {
    setSelectedPhoto(null);
    setError(null);
  };

  return {
    selectImageSource,
    selectedPhoto,
    isSelecting,
    error,
    clearPhoto,
  };
};
