import { InputFields } from "@/components/form/formInput";
import { NotificationBar } from "@/components/NotificationBar";
import { router } from "expo-router";
import Joi from "joi";
import { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { AppText, AppTextBold } from "../_layout";
import { apiRequest, BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";


const ChangeNumber = () =>{


  interface numberData {
    oldNumber: string;
    newNumber: string;
  }
  /* ===================== JOI SCHEMA ===================== */
  const numberSchema = Joi.object<numberData>({
    oldNumber: Joi.string()
      .required()
      .messages({
        "string.empty": "Old Password is required",
         "string.min": "Password must be at least 6 characters",
      }),
  
    newNumber: Joi.string()
      .min(6)
      .required()
      .messages({
        "string.empty": "New Password is required",
        "string.min": "Password must be at least 6 characters",
      }),
  });
  

  const [numberFormData, setNumberData] = useState<numberData>({
      oldNumber: "",
      newNumber: "",
    });
  
    const [error, setError] = useState<Partial<numberData>>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>("")
    const {setUser} = useAppStore();
    const [showNotification, setShowNotification] = useState(false);
  
    /* ===================== HANDLERS ===================== */
    const handlePswFormChange = (key: keyof numberData, value: string) => {
      setNumberData((prev) => ({ ...prev, [key]: value }));
  
      if (error[key]) {
        setError((prev) => ({ ...prev, [key]: "" }));
      }
       setError({});
    };
  
  const validate = (): boolean => {
    const { error } = numberSchema.validate(numberFormData, {
      abortEarly: false,
    });

    if (!error) {
      setError({});
      return true;
    }

    const newErrors: Partial<numberData> = {};
    error.details.forEach((detail) => {
      const key = detail.path[0] as keyof numberData;
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
      url: `${BaseURL}/auth/change_number/${user.email}`,
      method: "PUT",
      data: numberFormData,
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
          <AppTextBold className="text-[20px] font-[700] text-center mb-2">
            Hello, {user.username}
          </AppTextBold>
          <AppText className="text-center mb-6">
            Let’s get your number chnaged
          </AppText>

          <View className="flex flex-col gap-4">
            {/* Email */}
          <InputFields
              label=""
              placeHolder="Old number"
              value={numberFormData.oldNumber}
              action={(value: string) =>
                handlePswFormChange("oldNumber", value)
              }
              name="Old number"
              icon="call"
              // secureTextEntry
              error={numberFormData.newNumber}
            />

            {/* Password */}
            <InputFields
              label=""
              placeHolder="New number"
              value={numberFormData.newNumber}
              action={(value: string) =>
                handlePswFormChange("newNumber", value)
              }
              name="New number"
              icon="call"
              // secureTextEntry
              error={numberFormData.newNumber}
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

export default ChangeNumber;