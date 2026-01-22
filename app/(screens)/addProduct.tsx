import { useStatusBar } from "@/hooks/statusBar";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import "../../global.css";
import { AppText } from "../_layout";
import { BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";

/* ================================
   Cloudinary Config
================================ */
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtsiyyvu1/upload";
const CLOUDINARY_UPLOAD_PRESET = "smilefolder";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { vendor, user } = useAppStore();
  const storeId = vendor.store.id; // ✅ correct ID

  useStatusBar("white", "dark-content");

  /* ================================
     Upload to Cloudinary
  ================================ */
const uploadImageToCloudinary = async (uri: string): Promise<string> => {
  const formData = new FormData();

  if (uri.startsWith("blob:") || uri.startsWith("http")) {
    // ✅ WEB
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append("file", blob);
  } else {
    // ✅ MOBILE
    formData.append("file", {
      uri,
      name: "product.jpg",
      type: "image/jpeg",
    } as any);
  }

  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    console.error("Cloudinary error:", json);
    throw new Error(json?.error?.message || "Cloudinary upload failed");
  }

  return json.secure_url;
};

  /* ================================
     Submit Product
  ================================ */
  const handleSubmit = async () => {
    if (!name || !price) {
      Alert.alert("Error", "Name and price are required");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      const response = await fetch(`${BaseURL}/products/create_product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId,
          name,
          description,
          price,
          category,
          imageUrl,
          isAvailable,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to add product");
      }

      Alert.alert("Success", "Product added successfully");

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setIsAvailable(true);
      setImage(null);
    } catch (err: any) {
      console.error("ADD PRODUCT ERROR:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     UI
  ================================ */
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F9FAFB", paddingTop: 40 }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 50 }}
    >
      <AppText style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Add New Product
      </AppText>

      <TextInput
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        style={inputStyle}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[inputStyle, { minHeight: 80, textAlignVertical: "top" }]}
      />

      <TextInput
        placeholder="Price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
        style={inputStyle}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={inputStyle}
      />

      {/* Image Picker */}
      <TouchableOpacity
        onPress={async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission required");
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
          });

          if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
        }}
        style={imageBox}
      >
        {image ? (
          <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 12 }} />
        ) : (
          <View style={{ alignItems: "center" }}>
            <Ionicons name="camera-outline" size={80} />
            <AppText>Upload Image</AppText>
          </View>
        )}
      </TouchableOpacity>

      {/* Availability */}
      <TouchableOpacity
        onPress={() => setIsAvailable(!isAvailable)}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <Ionicons
          name={isAvailable ? "checkbox" : "square-outline"}
          size={24}
          color="#FF6B35"
          style={{ marginRight: 8 }}
        />
        <AppText>Available</AppText>
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#FFA07A" : "#FF6B35",
          padding: 16,
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <AppText style={{ color: "#FFF", fontWeight: "600", fontSize: 16 }}>
            Add Product
          </AppText>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const inputStyle = {
  backgroundColor: "#FFF",
  padding: 12,
  borderRadius: 12,
  marginBottom: 12,
};

const imageBox = {
  backgroundColor: "#FFF",
  padding: 12,
  borderRadius: 12,
  alignItems: "center" as const,
  marginBottom: 12,
};

export default AddProduct;
