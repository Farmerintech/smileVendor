import setupFocusManager from "@/app/lib/focusManager";
import setupOnlineManager from "@/app/lib/onlineManager";
import { queryClient } from "@/app/lib/queryClient";
import { useAppStore } from "@/app/store/useAppStore";
import "@/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";

import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";

import { useEffect } from "react";
import { StyleSheet, Text, TextProps, View } from "react-native";

/* ================================
   🔔 NOTIFICATIONS
================================ */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/* ================================
   🔄 REACT QUERY
================================ */

setupOnlineManager();
setupFocusManager();

/* ================================
   🚀 SPLASH
================================ */

SplashScreen.preventAutoHideAsync();

/* ================================
   🧠 ROOT
================================ */

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const {
    hydrate,
    user,
    hasCompletedOnboarding,
  } = useAppStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  // Hydrate Zustand
  useEffect(() => {
    hydrate();
  }, []);

  // Hide splash only when EVERYTHING is ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Handle initial routing (BEST PRACTICE)
  useEffect(() => {
    if (!fontsLoaded) return;

    if (!hasCompletedOnboarding) {
      router.replace("/(onboarding)");
      return;
    }

    if (!user || !user.email) {
      router.replace("/(auth)/signin");
      return;
    }

    router.replace("/(tabs)/orders");
  }, [fontsLoaded, hasCompletedOnboarding, user]);

if (!fontsLoaded) {
  return (
    <View style={styles.loadingContainer}>
      {/* <Text style={styles.loadingText}>Loading...</Text> */}
    </View>
  );
}


  const screenOptions = {
    headerShown: false,
    headerShadowVisible: false,
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={screenOptions}>
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(screens)" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

/* ================================
   ✍️ GLOBAL TEXT
================================ */

export const AppText: React.FC<TextProps> = ({ style, ...props }) => (
  <Text {...props} style={[{ fontFamily: "Inter_500Medium" }, style]} />
);

export const AppTextBold: React.FC<TextProps> = ({ style, ...props }) => (
  <Text {...props} style={[{ fontFamily: "Inter_700Bold" }, style]} />
);


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#093131", // bright green background
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
