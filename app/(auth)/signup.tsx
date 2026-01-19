import CountrySelectWithInput from "@/components/countries";
import { InputFields } from "@/components/form/formInput";
import { router } from "expo-router";
import Joi from "joi";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { NotificationBar } from "@/components/NotificationBar";
import "../../global.css";
import { BaseURL } from "../lib/api";

/* ===================== TYPES ===================== */
interface FormData {
  phoneNumber: string;
  username: string;
  email: string;
  password: string;
}

/* ===================== JOI SCHEMA ===================== */
const signUpSchema = Joi.object<FormData>({
  phoneNumber: Joi.string()
    .pattern(/^\d+$/)
    .min(8)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must contain only digits",
    }),

  username: Joi.string().min(2).required().messages({
    "string.empty": "Username is required",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter a valid email",
    }),

  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
});

/* ===================== COMPONENT ===================== */
const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: "",
    username: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<
    Partial<FormData & { confirmPassword: string }>
  >({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [showNotification, setShowNotification] = useState(false);

  const handleFormChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value.trim() }));
    if (error[key]) setError((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const { error } = signUpSchema.validate(formData, {
      abortEarly: false,
    });

    if (!error) {
      setError({});
      return true;
    }

    const newErrors: Partial<FormData> = {};
    error.details.forEach((detail) => {
      const key = detail.path[0] as keyof FormData;
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
      const response = await fetch(`${BaseURL}/auth/registeration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      const msg =
  Array.isArray(data?.message) ? data.message.join(", ") : String(data?.message);

      console.log(msg)
      setMessage(msg)
      setShowNotification(true);

      if (response.ok) {
        router.push("/(auth)/signin");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#093131" }}>
      <StatusBar barStyle="light-content" backgroundColor={"#093131"} />
{message !== "" && showNotification && (
        <NotificationBar
          trigger={showNotification}
          text={message}
          onHide={() => setShowNotification(false)}
        />
      )}
      {/* Top */}
      <View style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 24 }}>
        <Text className="text-[48px] font-bold text-white text-center mb-2">
          Smile
        </Text>
      </View>

      {/* Bottom */}
      <View
        style={{
          flex: 4,
          backgroundColor: "#FFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingHorizontal: 24,
          paddingTop: 32,
        }}
      >
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === "ios" ? 20 : 50}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text className="text-[30px] font-bold text-center mb-2">
            Create Account
          </Text>
          <Text className="text-center text-[16px] mb-6">
            Let’s get you started 🚀
          </Text>
          <Text>{message}</Text>

          {/* Phone */}
          <CountrySelectWithInput
            value={formData.phoneNumber}
            onChange={(text: string) => handleFormChange("phoneNumber", text)}
            error={error.phoneNumber}
          />

          <View className="flex gap-4 mt-4">
            <InputFields
              placeHolder="Email"
              value={formData.email}
              action={(v: string) => handleFormChange("email", v)}
              icon="mail"
              error={error.email}
              name="mail"
            />

            <InputFields
              placeHolder="Username"
              value={formData.username}
              action={(v: string) => handleFormChange("username", v)}
              icon="person"
              error={error.username}
              name="username"
            />

            <InputFields
              placeHolder="Password"
              value={formData.password}
              action={(v: string) => handleFormChange("password", v)}
              icon="key"
              error={error.password}
              name="password"
            />

            <InputFields
              placeHolder="Confirm password"
              value={confirmPassword}
              action={(v: string) => setConfirmPassword(v)}
              icon="key"
              error={error.confirmPassword}
              name="cpsw"
            />
          </View>

          <TouchableOpacity
            className={`py-4 rounded-full mt-6 ${
              loading ? "bg-gray-400" : "bg-[#093131]"
            }`}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-base">
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4 gap-2">
            <Text className="text-gray-500 text-sm">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={()=>router.replace("/(auth)/signin")} >
                <Text className="underline text-green-600 text-sm">Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
