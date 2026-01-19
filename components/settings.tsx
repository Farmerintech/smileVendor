import { AppTextBold } from "@/app/_layout";
import { useAppStore } from "@/app/store/useAppStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
 export const Item = ({
    icon,
    label,
    danger,
    onPress,
  }: {
    icon: any;
    label: string;
    danger?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
      }}
    >
      {/* Left Icon */}
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: danger ? "#FEE2E2" : "#F1F5F9",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons
          name={icon}
          size={18}
          color={danger ? "#EF4444" : "#475569"}
        />
      </View>

      {/* Label */}
      <AppTextBold
        style={{
          flex: 1,
          fontSize: 15,
          fontWeight: "500",
          color: danger ? "#EF4444" : "#1A1A1A",
        }}
      >
        {label}
      </AppTextBold>

      {/* Chevron */}
      <MaterialIcons
        name="chevron-right"
        size={22}
        color="#9CA3AF"
      />
    </TouchableOpacity>
  );
const SettingsList = () => {
  const router = useRouter();
const {setUser, logout} = useAppStore()
  const goTo = () =>{
    router.push("/(screens)/account")
  }
const Logout = () =>{
logout();
router.replace("/(auth)/signin")
}
  return (
    <View
      style={{
        marginTop: 12,
        marginBottom:24,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        overflow: "scroll",
      }}
    >
      <Item icon="receipt-outline" label="Order History" />
      <Item icon="person-outline" label="Account" onPress={()=>{goTo()}} />
      <Item icon="notifications-outline" label="Notifications" />
      <Item icon="trash-outline" label="Delete my account" danger />
      <Item icon="log-out-outline" label="Logout" danger  onPress={()=>{Logout()}} />
    </View>
  );
};

export default SettingsList;
