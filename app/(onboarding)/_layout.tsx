import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useAppStore } from "@/app/store/useAppStore";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { hasCompletedOnboarding, loading, user } = useAppStore();

  /* 🚦 GUARD: prevent onboarding from ever showing again */
  useEffect(() => {
    if (loading) return;

    if (hasCompletedOnboarding) {
      if (user?.email!=='') {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/signin");
      }
    }
  }, [hasCompletedOnboarding, loading, user]);

  // Prevent screen flash
  if (loading || hasCompletedOnboarding) {
    return null;
  }

  const options = {
    headerShown: false,
    headerShadowVisible: false,
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={options} />
        <Stack.Screen name="app" options={options} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
