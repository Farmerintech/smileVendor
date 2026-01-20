// screens/AddProduct.tsx
import { useStatusBar } from "@/hooks/statusBar";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, ScrollView, TextInput, TouchableOpacity } from "react-native";
import "../../global.css";
import { AppText } from "../_layout";
const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [image, setImage] = useState<any>(null);

  const handleSubmit = () => {
    if (!name || !price) {
      Alert.alert("Error", "Please fill in at least Name and Price");
      return;
    }

    const newProduct = {
      id: Math.random().toString(),
      name,
      description,
      price: parseFloat(price),
      category,
      isAvailable,
      image: image || require("@/assets/images/yakub.jpg"), // placeholder
    };

    // TODO: Save newProduct to database
    console.log("New Product:", newProduct);
    Alert.alert("Success", "Product added successfully!");

    // Reset form
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setIsAvailable(true);
    setImage(null);
  };
 useStatusBar("white", "dark-content");  

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
        style={{
          backgroundColor: "#FFFFFF",
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          backgroundColor: "#FFFFFF",
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
          minHeight: 80,
          textAlignVertical: "top",
        }}
      />

      <TextInput
        placeholder="Price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
        style={{
          backgroundColor: "#FFFFFF",
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={{
          backgroundColor: "#FFFFFF",
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
        }}
      />

      {/* Image Upload Placeholder */}
  <TouchableOpacity
  onPress={async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }}
  style={{
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  }}
>
  {image ? (
    <Image
      source={{ uri: image }}
      style={{ width: 100, height: 100, borderRadius: 12 }}
    />
  ) : (
    <AppText>Upload Image</AppText>
  )}
</TouchableOpacity>


      {/* Availability Toggle */}
      <TouchableOpacity
        onPress={() => setIsAvailable(!isAvailable)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Ionicons
          name={isAvailable ? "checkbox" : "square-outline"}
          size={24}
          color="#FF6B35"
          style={{ marginRight: 8 }}
        />
        <AppText>Available</AppText>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: "#FF6B35",
          padding: 16,
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        <AppText style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
          Add Product
        </AppText>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddProduct;
