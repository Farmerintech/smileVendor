import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";

interface NotificationBarProps {
  text: string;
  trigger: boolean;
  onHide?: () => void; // callback after hiding
}

export const NotificationBar = ({ text, trigger, onHide }: NotificationBarProps) => {
  const [show, setShow] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (trigger) {
      setShow(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setShow(false);
          onHide?.(); // notify parent that it's hidden
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!show) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        zIndex: 999,
        opacity: fadeAnim,
        paddingHorizontal: 14,
      }}
    >
      <View className="flex-row items-center flex flex-row items-center justify-center shadow-md gap-2 px-4 py-3  z-10 bg-white border-1 border-gray-200 py-2 rounded">
        <Ionicons name="notifications-outline" size={20} color="#1EBA8D" />
        <Text className="text-gray-800 font-medium">{text}</Text>
      </View>
    </Animated.View>
  );
};
