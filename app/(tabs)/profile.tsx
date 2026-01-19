
import SettingsList from "@/components/settings";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

import { useStatusBar } from "@/hooks/statusBar";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import "../../global.css";
import { AppTextBold } from "../_layout";
import { useAppStore } from "../store/useAppStore";
interface FormData {
  phoneNumber: string
}
const yakub = require('@/assets/images/yakub.jpg')
const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ phoneNumber: "" });
  const [error, setError] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  const handleFormChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (error[key]) setError((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    let valid = true;
    const newErrors: Partial<FormData> = {};

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
      valid = false;
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must contain only digits.";
      valid = false;
    }

    setError(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("your-api-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message || response.statusText);
      } else {
        // Handle success
      }
    } catch (error) {
      console.error("Network or server error:", error);
    } finally {
      setLoading(false);
    }
  };

 useStatusBar("#093131", "light-content");  
 const {user} = useAppStore()
 return (
    <View style={{ flex: 1, backgroundColor: "#093131", paddingTop:30 }}>

          {/* <StatusBar backgroundColor={"#093131"} barStyle={"light-content"}/> */}
      {/* Top 25% */}
      <View style={{ flex: 0.5, justifyContent: "flex-start", alignItems:"center", paddingHorizontal: 24}}>
        
        <View className="bg-[#FF6B35] w-[80px] h-[40px] flex justify-center absolute right-10 mt-5 flex-row items-center px-5 rounded-full">
          <AppTextBold className="text-[20px] font-bold text-white text-center mb-2 ">
          Help
        </AppTextBold>
        </View>
      </View>
      <View className="flex items-center flex-row justify-between px-5 mb-5">
       <View className="flex flex-1 flex-row items-center justify-start gap-3 ">
         <View className="">
              <Image
            source={yakub}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 3,
              borderColor: "#FF6B35",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
          />
        </View>
        <View className="flex items-start flex-wrap flex-1">
          <AppTextBold className="text-[28px] text-white text-center mb-2">
           {user.username}
        </AppTextBold>
        <Text className="text-white text-[12px]">{user.email}</Text>
        </View>
       </View>
        <TouchableOpacity onPress={()=>router.push("/(screens)/account")}>
          <Ionicons name="chevron-forward" size={25} color="#FF6B35"/>
        </TouchableOpacity>
      </View>

      {/* Bottom 75% Modal */}
      <View
        style={{
          flex: 3,
          backgroundColor: "#FFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingHorizontal: 2,
          paddingTop: 32,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 24, }}>
            <AppTextBold className="text-[30px] font-[600] text-left mb-2">
              Profile
            </AppTextBold>
          </View>

         <SettingsList/>
        </ScrollView>

      </View>

    </View>
  );
};

export default SignIn;
