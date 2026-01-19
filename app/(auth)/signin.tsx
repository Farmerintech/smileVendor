import { router } from "expo-router";
import Joi from "joi";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { InputFields } from "@/components/form/formInput";
import { NotificationBar } from "@/components/NotificationBar";
import "../../global.css";
import { BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";

/* ===================== TYPES ===================== */
interface FormData {
  email: string;
  password: string;
}

/* ===================== JOI SCHEMA ===================== */
const signInSchema = Joi.object<FormData>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter a valid email address",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
});

/* ===================== COMPONENT ===================== */
const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [showNotification, setShowNotification] = useState(false);

  const { setUser } = useAppStore();

  /* ===================== HANDLERS ===================== */
  const handleFormChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (error[key]) {
      setError((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validate = (): boolean => {
    const { error } = signInSchema.validate(formData, {
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
      const response = await fetch(`${BaseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      setMessage(data?.message || "");
      setShowNotification(true);

      if (response.ok) {
        setUser({
          username: data.user.username,
          email: data.user.email,
          isLoggedIn: true,
          token: data.user.token,
        });
        router.replace("/(tabs)/home");

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

      {/* Notification */}
      {message !== "" && showNotification && (
        <NotificationBar
          trigger={showNotification}
          text={message}
          onHide={() => setShowNotification(false)}
        />
      )}

      {/* Top Section */}
      <View style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 24 }}>
        <Text className="text-[48px] font-bold text-white text-center mb-2">
          Smile
        </Text>
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
          <Text className="text-[30px] font-bold text-center mb-2">
            Welcome Back
          </Text>
          <Text className="text-center text-[18px] mb-6">
            Let’s get you signed in 👋
          </Text>

          <View className="flex flex-col gap-4">
            {/* Email */}
            <InputFields
              label=""
              placeHolder="Email"
              value={formData.email}
              action={(value: string) => handleFormChange("email", value)}
              name="email"
              icon="mail"
              error={error.email}
            />

            {/* Password */}
            <InputFields
              label=""
              placeHolder="Password"
              value={formData.password}
              action={(value: string) => handleFormChange("password", value)}
              name="password"
              icon="key"
              // secureTextEntry
              error={error.password}
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
                {loading ? "Signing in..." : "Login"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Register */}
          <View className="flex flex-row items-center justify-center gap-2 mt-6">
            <Text className="text-gray-500 text-sm">
              Don’t have a Smile account?
            </Text>
            <TouchableOpacity onPress={()=>router.replace("/(auth)/signup")} >
              <Text className="underline text-green-600 text-sm">Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
