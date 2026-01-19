import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { GestureResponderEvent, Image, StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import "../../global.css";
import { AppText } from '../_layout';
import { useAppStore } from '../store/useAppStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const yakub = require("@/assets/images/yakub.jpg")
  const {cart} = useAppStore()

 
  const moveToCart = () => {
    router.push("/order"); // <-- use push, not a direct call
  };

// Minimal type for tab bar button props
type TabBarButtonProps = {
  accessibilityState?: { selected?: boolean };
  children?: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  style?: StyleProp<ViewStyle>;
  delayLongPress?: number | null; // allow null
  [key: string]: any; // allow any extra props from Tabs
};

// Usage in screenOptions


    // const {user} = useAppStore();
    // useEffect(()=>{
    //   if(!user || user.email===''){
    //     router.replace("/(auth)/signin")
    //   }
    // })
  return (
    <Tabs
screenOptions={{
  headerShown: false,
  tabBarActiveTintColor: '#093131',
  tabBarInactiveTintColor: 'gray',
  // tabBarStyle: {
  //   height: 90 ,
  //   paddingTop: 5,
  //   paddingBottom:0,
  //   borderTopWidth: 0,
  //   backgroundColor: 'white',
  //   elevation: 5,
  //   opacity:1,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowRadius: 5,
  //   shadowOffset: { width: 0, height: 3 },
  // },
  tabBarLabelStyle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  tabBarBackground: undefined,
 tabBarButton: (props: TabBarButtonProps) => {
  const { delayLongPress, ...rest } = props; // remove delayLongPress so TypeScript is happy
  return <TouchableOpacity {...rest} activeOpacity={1} />;
},
}}
    >
      {/* Home */}
      <Tabs.Screen
        name="home"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#F9FAFB",
            // height: 70,
          },
          headerTitle: () => (
            <View className=" pt-4">
              <View
                className="flex-row items-center justify-between mb-2"
                style={{ gap: 30 }}
              >
                <View className="flex-row items-center justify-between mb-2"
                style={{ gap: 10 }}>
                <Image
            source={yakub}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              borderWidth: 3,
              borderColor: "#FF6B35",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
          />
                {/* Greeting */}
                <View>
                  <AppText
                    className="text-[16px] font-bold"
                    style={{ color: "#1A1A1A" }}
                  >
                    {/* Hello, {user?.username} 👋 */}
                  </AppText>
                  <Text className="text-[14px]" style={{ color: "#6B7280" }}>
                    What can we help you find?
                  </Text>
                </View>
                </View>
            <View className='flex gap-4 flex-row items-center'>
                  {/* Notifications */}
                <View className="flex-row items-center gap-3">
                  <TouchableOpacity
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "#FFFFFF",
                      shadowColor: "#000",
                      shadowOpacity: 0.08,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 3 },
                      elevation: 3,
                    }}
                  >
                    <Ionicons
                      name="notifications-outline"
                      size={20}
                      color="#1A1A1A"
                    />
                  </TouchableOpacity>
                </View>
                 <View className="flex-row items-center gap-3">
                  <TouchableOpacity
                  onPress={()=>{moveToCart()}}
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "#FFFFFF",
                      shadowColor: "#000",
                      shadowOpacity: 0.08,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 3 },
                      elevation: 3,
                    }}
                  >
                    <View className='relative'>
                      <Ionicons
                      name="cart-outline"
                      size={20}
                      color="#1A1A1A"
                    />
                    <Text className='absolute -top-3 left-2 text-[#FF6B35]'>{cart.length}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
            </View>

              </View>
            </View>
          ),
          headerTitleAlign: "left",

          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="home"
              size={22}
              color={focused ? "#093131" : "gray"}
            />
          ),
        }}
      />

      {/* Search */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarLabel: "Search",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="search"
              size={20}
              color={focused ? '#093131' : 'gray'}
            />
          ),
        }}
      />

      {/* Orders */}
      <Tabs.Screen
        name="order"
        options={{
          title: 'Orders',
          headerShown: false,
          headerStyle: {
            backgroundColor: '#093131',
            elevation: 4,
          },
          headerTitle: () => (
            <Text className="text-white font-semibold text-[18px] px-4">Orders</Text>
          ),
          tabBarLabel: "Orders",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="bag"
              size={20}
              color={focused ? '#093131' : 'gray'}
            />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: () => (
            <View className="flex flex-row justify-start gap-4 items-center px-4 w-full">
              <TouchableOpacity
                onPress={() => router.back()}
                className="items-center justify-center flex"
              >
                <MaterialIcons name="chevron-left" size={26} color={'black'} />
              </TouchableOpacity>
              <AppText className="font-semibold text-[16px]">Profile</AppText>
            </View>
          ),
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person"
              size={20}
              color={focused ? '#093131' : 'gray'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
