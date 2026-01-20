import { useAppStore } from "@/app/store/useAppStore";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useEffect } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import "../../global.css";

export default function App() {

  const completeOnboarding = useAppStore(s => s.completeOnboarding);
  const hasCompletedOnboarding = useAppStore(s => s.hasCompletedOnboarding);

  useEffect(() => {
    return () => {
      if (!hasCompletedOnboarding) {
        completeOnboarding();
      }
    };
  }, [hasCompletedOnboarding]);

  const handleVendor = () => {
    // TODO: Navigate to Vendor onboarding or dashboard
    console.log("Continue as Vendor");
  }

  const handleRider = () => {
    // TODO: Navigate to Rider onboarding or dashboard
    router.replace("/(tabs)/home")
    console.log("Continue as Rider");
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        contentContainerClassName="flex-1 justify-center items-center bg-[#093131] py-[24px]"
      >
        <SafeAreaView className="flex-1 justify-center items-center w-full px-6">

          {/* Main Card */}
          <View className="py-8 px-6 w-full max-w-[360px] bg-[#0E3B36] rounded-[24px] items-center justify-center">

            {/* Icon */}
            <View className="w-[120px] h-[120px] rounded-full bg-[#1EBA8D]/20 items-center justify-center mb-6">
              <Ionicons name="cube-outline" size={62} color="#1EBA8D" />
            </View>

            {/* Title */}
            <Text className="text-white text-[24px] font-bold text-center mb-3">
              Get Started with Vendorhub
            </Text>

            {/* Description */}
            <Text className="text-[#CFEDEA] text-[16px] text-center mb-8">
              Choose how you want to use the app. 
              Vendors can manage deliveries and orders. 
              Riders can deliver items quickly and efficiently.
            </Text>

            {/* Buttons */}
            <View className="w-full space-y-4">

              <TouchableOpacity
                onPress={handleVendor}
                className="bg-[#1EBA8D] py-3 rounded-full items-center"
              >
                <Text className="text-white font-bold text-[16px]">
                  Continue as Vendor
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRider}
                className="border border-[#1EBA8D] py-3 rounded-full items-center"
              >
                <Text className="text-[#1EBA8D] font-bold text-[16px]">
                  Continue as Rider
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
