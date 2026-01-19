import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import "../../global.css";

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore } from '../store/useAppStore';

export const BottomShadow: React.FC = () => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        backgroundColor: 'black',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: Platform.OS === 'android' ? 8 : 0,
        zIndex: 10,
      }}
    />
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
   const {user} = useAppStore();
    useEffect(()=>{
      if(user && user.email!==''){
        router.replace("/(tabs)/home")
      }
    })
  const router = useRouter();

  if (!loaded) {
    return null;
  }

  const screenOptions = {
    headerShown: true,
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: '#fff',
    },
    headerTitle: '',
   headerLeft: () => (
  <TouchableOpacity
    onPress={() => router.back()}
    className="bg-stone-100 flex justify-center items-center w-[40px] h-[40px] rounded-full ml-4"
    style={{
      paddingHorizontal: 0, // Tailwind handles width
      backgroundColor: '#f5f5f4', // fallback for bg-stone-100
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      borderRadius: 20,
      marginLeft: 4,
    }}
  >
    <Ionicons name="arrow-back" size={20} color="#333" />
  </TouchableOpacity>
),
    headerRight: () => (
      <TouchableOpacity onPress={() => console.log('Continue as guest')} style={{ paddingHorizontal: 8 }}>
        <Text style={{ fontSize: 14 }} className='text-[#FF6347] underline'>Continue as guest</Text>
      </TouchableOpacity>
    ),
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="signup"  options={{
          headerShown: false,
          headerShadowVisible: false,
        headerTitle: '',

        }} />
        <Stack.Screen name="signin"  options={{
          headerShown: false,
          headerShadowVisible: false,
        headerTitle: '',

        }} />
      
       {/* <Stack.Screen
  name="account"
  options={{
    headerShown: true,
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: "#093131", // header background
    },
    headerTintColor: "white", // back button & title color
    headerTitle: () => (
      <View>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          My Account
        </Text>
      </View>
    ),
  }}
/> */}

         
        <Stack.Screen name="otp" 
        options={{
          headerShown: false,
          headerShadowVisible: false,
        headerTitle: '',

        }} />
      </Stack>

      {/* Bottom shadow */}
      {/* <BottomShadow /> */}

      
    </ThemeProvider>
  );
}
