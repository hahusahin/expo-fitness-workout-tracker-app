import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  // Validate required environment variables
  const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  if (!googleApiKey) {
    throw new Error(
      "EXPO_PUBLIC_GOOGLE_API_KEY is required in environment variables"
    );
  }

  return {
    ...config,
    name: "Workout Tracker App",
    slug: "workout-tracker-app",
    version: "1.0.0",
    scheme: "exp+fit-app",
    userInterfaceStyle: "automatic",
    orientation: "default",
    owner: "hahusahin",
    splash: {
      image: "src/assets/images/splash-screen-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: "https://n",
        },
      ],
      "expo-web-browser",
      "expo-secure-store",
      "expo-font",
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you set a profile picture.",
          cameraPermission:
            "The app accesses your camera to let you take a profile picture.",
        },
      ],
    ],
    android: {
      softwareKeyboardLayoutMode: "pan",
      package: "com.hahusahin.fitnessapp",
      googleServicesFile: "./google-services.json",
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
      config: {
        googleMaps: {
          apiKey: googleApiKey,
        },
      },
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.hahusahin.fitnessapp",
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app needs access to your location to find nearby fitness centers and gyms.",
      },
      config: {
        googleMapsApiKey: googleApiKey,
      },
    },
    web: {
      output: "server",
    },
    extra: {
      router: {
        origin: "https://n",
      },
      eas: {
        projectId: "c6a98400-b81e-487e-96e5-2399ec89a7b9",
      },
    },
  };
};
