import { InputFields } from "@/components/form/formInput";
import { NotificationBar } from "@/components/NotificationBar";
import { router } from "expo-router";
import Joi from "joi";
import { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { AppText, AppTextBold } from "../_layout";
import { apiRequest, BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";


const ChangePSW = () =>{

  interface passwordData {
    oldPassword: string;
    newPassword: string;
  }
  
  interface numberData {
    oldNumber?: string;
    newNumber?: string;
  }
  /* ===================== JOI SCHEMA ===================== */
  const passwordSchema = Joi.object<passwordData>({
    oldPassword: Joi.string()
      .required()
      .messages({
        "string.empty": "Old Password is required",
         "string.min": "Password must be at least 6 characters",
      }),
  
    newPassword: Joi.string()
      .min(6)
      .required()
      .messages({
        "string.empty": "New Password is required",
        "string.min": "Password must be at least 6 characters",
      }),
  });
  

  const [pswFormData, setPswFormData] = useState<passwordData>({
      oldPassword: "",
      newPassword: "",
    });
  
    const [error, setError] = useState<Partial<passwordData>>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>("")
      const [showNotification, setShowNotification] = useState(false);

        const {setUser} = useAppStore();
  
    /* ===================== HANDLERS ===================== */
    const handlePswFormChange = (key: keyof passwordData, value: string) => {
      setPswFormData((prev) => ({ ...prev, [key]: value }));
  
      if (error[key]) {
        setError((prev) => ({ ...prev, [key]: "" }));
      }
    };
  
  const validate = (): boolean => {
    const { error } = passwordSchema.validate(pswFormData, {
      abortEarly: false,
    });

    if (!error) {
      setError({});
      return true;
    }

    const newErrors: Partial<passwordData> = {};
    error.details.forEach((detail) => {
      const key = detail.path[0] as keyof passwordData;
      newErrors[key] = detail.message;
    });

    setError(newErrors);
    setMessage(Object.values(newErrors)[0]); // show first error in notification
    setShowNotification(true);
    return false;
  };

  
const handleSubmit = async () => {
  if (!validate()) return;

  setLoading(true);
  try {
    const data = await apiRequest<{
      message: string;
      // user: {
      //   username: string;
      //   email: string;
      //   token: string;
      // };
    }>({
      url: `${BaseURL}/auth/change_password/${user.email}`,
      method: "PUT",
      data: pswFormData,
    });

    setMessage(data?.message);
    
    setTimeout(()=>{
      router.push("/account");
    }, 1000)
    console.log(message)
  } catch (err: any) {
    console.error("Change password failed:", err?.message || err);
    setMessage(err?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

    const {user} = useAppStore()
    const now = new Date().getTime()
    return(
    <SafeAreaView style={{ flex: 1, backgroundColor: "#093131" }}>
      <StatusBar barStyle="light-content" />
       {message !== "" && showNotification && (
        <NotificationBar
          trigger={showNotification}
          text={message}
          onHide={() => setShowNotification(false)}
        />
      )}
      {/* Top Section */}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: 24,
        }}
      >
        <AppTextBold className="text-[48px] font-bold text-white text-center mb-2">
          Smile
        </AppTextBold>
        <Text className="text-[#CFEDEA] text-center text-[14px]" />
      </View>

      {/* Bottom Section */}
      <View
        style={{
          flex: 3,
          backgroundColor: "#FFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingHorizontal: 24,
          paddingTop: 32,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AppText className="text-[20px] font-[700] text-center mb-2">
            Hello, {user.username}
          </AppText>
          <AppText className="text-center mb-6">
            Let’s get your password changed.
          </AppText>

          <View className="flex flex-col gap-4">
            {/* Email */}
          <InputFields
              label=""
              placeHolder="Old password"
              value={pswFormData.oldPassword}
              action={(value: string) =>
                handlePswFormChange("oldPassword", value)
              }
              name="oldPassword"
              icon="key"
              // secureTextEntry
              error={pswFormData.newPassword}
            />

            {/* Password */}
            <InputFields
              label=""
              placeHolder="New password"
              value={pswFormData.newPassword}
              action={(value: string) =>
                handlePswFormChange("newPassword", value)
              }
              name="password"
              icon="key"
              // secureTextEntry
              error={pswFormData.newPassword}
            />
          </View>

          {/* Submit */}
          <View className="mt-6">
            <TouchableOpacity
              className={`py-4 rounded-full ${
                loading ? "bg-gray-400" : "bg-[#093131]"
              }`}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-base">
                {loading ? "Loading..." : "Change"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Register */}
          {/* <View className="flex flex-row items-center justify-center gap-2 mt-6">
            <Text className="text-gray-500 text-sm">
              Don’t have a Smile account?
            </Text>
            <Link href="/signup" className="underline text-[#1EBA8D] text-sm">
              Register
            </Link>
          </View> */}
        </ScrollView>
      </View>
    </SafeAreaView>
    )
}

export default ChangePSW;