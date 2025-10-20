import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  // Validate required environment variables
  const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

  // For builds, provide a fallback or make it optional
  if (!googleApiKey) {
    console.warn(
      "⚠️  EXPO_PUBLIC_GOOGLE_API_KEY not found. Google Maps features will be disabled."
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
    platforms: ["ios", "android"], // Explicitly exclude web
    plugins: [
      [
        "expo-splash-screen",
        {
          image: "./src/assets/icons/splash-light.png",
          // imageWidth: 200
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            image: "./src/assets/icons/splash-dark.png",
            backgroundColor: "#000000",
          },
        },
      ],
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
      adaptiveIcon: {
        foregroundImage: "./src/assets/icons/android-adaptive.png",
        monochromeImage: "./src/assets/icons/android-adaptive.png",
        backgroundColor: "#FFFFFF",
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
      icon: {
        light: "./src/assets/icons/ios-light.png",
        dark: "./src/assets/icons/ios-dark.png",
        tinted: "./src/assets/icons/ios-tinted.png",
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
