import { ExpoConfig, ConfigContext } from "expo/config";

const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
const appVariant = process.env.APP_VARIANT;
// App config for production environment.
const APP_NAME = "Workout Tracker";
const BUNDLE_IDENTIFIER = "com.hahusahin.fitnessapp"; // iOS bundle identifier
const PACKAGE_NAME = "com.hahusahin.fitnessapp"; // Android package name
const SCHEME = "workout-tracker";

export default ({ config }: ConfigContext): ExpoConfig => {
  const { name, bundleIdentifier, scheme } = getDynamicAppConfig(
    (appVariant as "development" | "preview" | "production") || "development"
  );

  return {
    ...config,
    name,
    slug: "workout-tracker-app",
    version: "1.0.0",
    scheme,
    userInterfaceStyle: "automatic",
    orientation: "default",
    owner: "hahusahin",
    platforms: ["ios", "android"], // Explicitly excluded web
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
      "expo-router",
      // [
      //   "expo-router",
      //   {
      //     origin: "https://n",
      //   },
      // ],
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
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: "workout-tracker",
          organization: "hhs-ql",
        },
      ],
    ],
    android: {
      softwareKeyboardLayoutMode: "pan",
      package: PACKAGE_NAME,
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
      bundleIdentifier,
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
    // Removed web configuration - mobile-only app
    // web: {
    //   output: "server",
    // },
    extra: {
      // router: {
      //   origin: "https://n",
      // },
      eas: {
        projectId: "c6a98400-b81e-487e-96e5-2399ec89a7b9",
      },
    },
  };
};

// Dynamically configure the app based on the environment.
export const getDynamicAppConfig = (
  environment: "development" | "preview" | "production"
) => {
  if (environment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      // packageName: PACKAGE_NAME,
      scheme: SCHEME,
    };
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      // packageName: `${PACKAGE_NAME}.preview`,
      scheme: `${SCHEME}-prev`,
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    // packageName: `${PACKAGE_NAME}.dev`,
    scheme: `${SCHEME}-dev`,
  };
};
