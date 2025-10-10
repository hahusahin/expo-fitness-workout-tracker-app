import { useState, useEffect } from "react";
import * as Location from "expo-location";

interface LocationData {
  latitude: number;
  longitude: number;
}

export const useLocationPermission = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError(
          "Location permission denied. Please enable location access in your device settings."
        );
        return;
      }

      // Get current location
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      });
    } catch (err) {
      setError("Failed to get your location. Please try again.");
      console.error("Location error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  return {
    location,
    loading,
    error,
    requestLocation,
  };
};
