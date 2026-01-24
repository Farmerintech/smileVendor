import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import '../../global.css';
import { AppText } from '../_layout';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const yakub = require('@/assets/images/yakub.jpg');
  // const { order } = useAppStore();

  const moveToCart = () => router.push('/orders');

  // Custom Tab Button
  const CustomTabButton = ({
    children,
    accessibilityState,
    onPress,
  }: {
    children: React.ReactNode;
    accessibilityState?: { selected?: boolean };
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
  }) => {
    const focused = accessibilityState?.selected;
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        style={[
          styles.tabButton,
          focused && styles.tabButtonActive,
        ]}
      >
        {children}
      </TouchableOpacity>
    );
  };

  // Render Icon + Label
 const renderTab = (focused: boolean, iconName: string, label: string) => (
  <View
    style={[
      styles.tabContent,
      focused && styles.tabContentFocused, // apply pill bg when focused
    ]}
  >
    <Ionicons
      name={iconName as any}
      size={15}
      color={focused ? 'white' : 'gray'}
    />
    {focused && <Text style={styles.tabLabel}>{label}</Text>}
  </View>
);


  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#093131',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 70 + insets.bottom, paddingBottom: insets.bottom },
        tabBarButton: (props) => <CustomTabButton {...props} />,
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="orders"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerTitleAlign: 'left',
          headerTitle: () => (
            <View className="pt-4">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 30 }}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Image
                    source={yakub}
                    style={{ width: 50, height: 50, borderRadius: 50, borderWidth: 3, borderColor: '#FF6B35' }}
                  />
                  <View>
                    <AppText className="text-[16px] font-bold" />
                    <Text style={{ color: '#6B7280', fontSize: 14 }}>What can we help you find?</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={moveToCart} style={styles.iconButton}>
                    <View style={{ position: 'relative' }}>
                      <Ionicons name="cart-outline" size={20} color="#1A1A1A" />
                      {/* {cart.length > 0 && (
                        <Text style={styles.cartBadge}>{cart.length}</Text>
                      )} */}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ),
          tabBarIcon: ({ focused }) => renderTab(focused, 'cart-outline', 'Orders'),
        }}
      />

      {/* SEARCH */}
      <Tabs.Screen
        name="products"
        
        options={{
          headerShown:true,
          headerTitle:"Products",
          tabBarIcon: ({ focused }) => renderTab(focused, 'cube-outline', 'Products'),
        }}
      />

      {/* ORDERS */}
      <Tabs.Screen
        name="payout"
        options={{
          headerShown:true,
          headerTitle:"Payouts",
          tabBarIcon: ({ focused }) => renderTab(focused, 'wallet-outline', 'Payout'),
        }}
      />

      {/* INSIGHT */}
      <Tabs.Screen
        name="insight"
        options={{
          headerShown:true,
          headerTitle:"Insight",
          tabBarIcon: ({ focused }) => renderTab(focused, 'stats-chart-outline', 'Insight'),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => renderTab(focused, 'person-outline', 'Profile'),
        }}
      />
         {/* <Tabs.Screen
        name="updateStorInfo"
        options={{
          href: null,           // 👈 hides from tab bar
          tabBarStyle: { display: "flex" },
        }}
      /> */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  // tabContent: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   // backgroundColor: '#1A1A1A',
  // },
  // tabLabel: {
  //   color: 'white',
  //   fontSize: 13,
  //   marginLeft: 6,
  //   fontWeight: '700',
  // },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    left: 12,
    color: '#FF6B35',
    fontWeight: '700',
    fontSize: 12,
  },
    tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  tabContentFocused: {
    backgroundColor: '#1A1A1A', // the pill background
    //  paddingVertical: 15,
    paddingHorizontal: -10,
    width:80,
    height:40,
    borderRadius: 50,

  },
  tabLabel: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },

});
