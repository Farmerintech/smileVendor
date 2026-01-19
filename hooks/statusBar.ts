import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { StatusBar } from "react-native";

export function useStatusBar(
  backgroundColor: string,
  style: "light-content" | "dark-content" = "light-content"
) {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(backgroundColor, true);
      StatusBar.setBarStyle(style, true);

      return () => {
        // optional reset
      };
    }, [backgroundColor, style])
  );
}
