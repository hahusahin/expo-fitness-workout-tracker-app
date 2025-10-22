import React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { FitnessCenter } from "@/shared/types/requests";
import { Ionicons } from "@expo/vector-icons";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface FitnessMapProps {
  userLocation: LocationCoords;
  fitnessCenters?: FitnessCenter[];
  onFitnessCenterPress?: (center: FitnessCenter) => void;
  style?: any;
}

export default function FitnessMap({
  userLocation,
  fitnessCenters = [],
  onFitnessCenterPress,
  style,
}: FitnessMapProps) {
  const mapRef = React.useRef<MapView>(null);
  const [mapReady, setMapReady] = React.useState(false);
  const [shouldRenderMarkers, setShouldRenderMarkers] = React.useState(false);

  // Calculate region to fit all markers
  const calculateRegion = () => {
    if (!fitnessCenters.length) {
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      };
    }

    // Include user location and all fitness centers
    const allLocations = [
      userLocation,
      ...fitnessCenters.map((center) => center.location),
    ];

    const latitudes = allLocations.map((loc) => loc.latitude);
    const longitudes = allLocations.map((loc) => loc.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    // Add padding around the bounds
    const latDelta = (maxLat - minLat) * 1.4; // 40% padding
    const lngDelta = (maxLng - minLng) * 1.4;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.01), // Minimum zoom level
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  };

  const initialRegion = calculateRegion();

  const animateToFitAllMarkers = () => {
    if (mapReady && mapRef.current) {
      const region = calculateRegion();
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  // Delay marker rendering until map is fully ready
  React.useEffect(() => {
    if (mapReady) {
      // Small delay to ensure map is fully mounted before adding markers
      const timer = setTimeout(() => {
        setShouldRenderMarkers(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [mapReady]);

  React.useEffect(() => {
    // Animate to show all markers when map is ready or fitness centers change
    if (mapReady && shouldRenderMarkers) {
      setTimeout(() => {
        animateToFitAllMarkers();
      }, 500);
    }
  }, [userLocation, mapReady, shouldRenderMarkers, fitnessCenters]);

  return (
    <View className="flex-1 overflow-hidden bg-gray-50" style={style}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={initialRegion}
        onMapReady={() => setMapReady(true)}
        showsUserLocation
        showsMyLocationButton
        mapType="standard"
        zoomEnabled
        scrollEnabled
        pitchEnabled
        rotateEnabled
        moveOnMarkerPress={false}
        // loadingEnabled
        // loadingIndicatorColor="#3b82f6"
        // loadingBackgroundColor="#f9fafb"
        // showsCompass
        // showsScale={false}
      >
        {/* Fitness Center Markers - Only render when map is ready */}
        {shouldRenderMarkers && fitnessCenters.map((center) => (
          <Marker
            key={center.id}
            coordinate={center.location}
            // title={center.name}
            pinColor="orange" // Custom hex color is not working for Android
            onPress={() => onFitnessCenterPress?.(center)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
