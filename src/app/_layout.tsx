import "../global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useAuth } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NotificationProvider } from "@/shared/contexts/NotificationContext";
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as Notifications from "expo-notifications";
import * as Sentry from "@sentry/react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 0,
    },
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

Sentry.init({
  dsn: "https://c39788999c5968760d8c49b370368b20@o4510227954794496.ingest.de.sentry.io/4510231696506960",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  spotlight: __DEV__,
});

function AppNavigator() {
  const { isLoaded, isSignedIn } = useAuth();

  const [fontsLoaded] = useFonts({
    "Lexend-Regular": require("../assets/fonts/Lexend-Regular.ttf"),
    "Lexend-Semibold": require("../assets/fonts/Lexend-SemiBold.ttf"),
    "Lexend-Bold": require("../assets/fonts/Lexend-Bold.ttf"),
    "Lexend-Black": require("../assets/fonts/Lexend-Black.ttf"),
  });

  if (!isLoaded || !fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="exercise-detail"
          options={{
            headerShown: false,
            presentation: "transparentModal",
            animation: "none",
          }}
        />
        <Stack.Screen
          name="fitness-centers"
          options={{
            title: "Nearby Fitness Centers",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

function Layout() {
  return (
    <NotificationProvider>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      >
        <QueryClientProvider client={queryClient}>
          <KeyboardProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
                <AppNavigator />
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </KeyboardProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </NotificationProvider>
  );
}

export default Sentry.wrap(Layout);
