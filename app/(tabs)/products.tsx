// screens/Products.tsx
import { useStatusBar } from "@/hooks/statusBar";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import "../../global.css";
import { AppText } from "../_layout";

// Dummy products data (replace with DB data)
const initialProducts = [
  {
    id: "1",
    name: "Chicken Sandwich",
    description: "Delicious grilled chicken",
    price: 2500,
    category: "Food",
    imageUrl: require("@/assets/images/yakub.jpg"),
    isAvailable: true,
  },
  {
    id: "2",
    name: "Burger",
    description: "Cheesy beef burger",
    price: 3000,
    category: "Food",
    imageUrl: require("@/assets/images/yakub.jpg"),
    isAvailable: true,
  },
];

const Products = () => {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
 useStatusBar("white", "dark-content");  

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB", paddingTop: 40 }}>
      {/* ================= ADD NEW PRODUCT BUTTON ================= */}
   

      {/* ================= PRODUCT LIST ================= */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 50 }}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <Image
              source={item.imageUrl}
              style={{ width: 60, height: 60, borderRadius: 12 }}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <AppText style={{ fontWeight: "600", fontSize: 16 }}>
                {item.name}
              </AppText>
              <AppText style={{ color: "#6B7280", fontSize: 13 }}>
                {item.description}
              </AppText>
              <AppText style={{ fontWeight: "600", fontSize: 14 }}>
                ₦{item.price.toLocaleString()} - {item.category}
              </AppText>
            </View>
            <MaterialIcons name="edit" size={22} color="#FF6B35" />
          </View>
        )}
      />
         <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => router.push("/(screens)/addProduct")}
          style={{
            backgroundColor: "#FF6B35",
            padding: 14,
            borderRadius: 16,
            alignItems: "center",
          }}
        >
          <AppText style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
            + Add New Product
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Products;
