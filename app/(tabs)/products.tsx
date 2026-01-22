import { useStatusBar } from "@/hooks/statusBar";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../../global.css";
import { AppText } from "../_layout";
import { BaseURL } from "../lib/api";

type Product = {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
};

const Products = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useStatusBar("white", "dark-content");

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BaseURL}/products/get_products`); // 👈 change
      const json = await res.json();
      setProducts(json.data);
    } catch (err) {
      console.log("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= UPDATE PRODUCT FIELD ================= */
  const updateField = (
    productId: string,
    field: keyof Product,
    value: any
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, [field]: value } : p
      )
    );
  };

  /* ================= SAVE PRODUCT ================= */
  const saveProduct = async (product: Product) => {
    try {
      await fetch(`/products/edit_product/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      setExpandedId(null);
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  /* ================= RENDER ITEM ================= */
  const renderItem = ({ item }: { item: Product }) => {
    const isExpanded = expandedId === item.id;

    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
        }}
      >
        {/* ===== COLLAPSED VIEW ===== */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: item.imageUrl }}
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
              ₦{Number(item.price).toLocaleString()} • {item.category}
            </AppText>
          </View>

          <TouchableOpacity
            onPress={() =>
              setExpandedId(isExpanded ? null : item.id)
            }
          >
            <MaterialIcons
              name={isExpanded ? "close" : "edit"}
              size={22}
              color="#FF6B35"
            />
          </TouchableOpacity>
        </View>

        {/* ===== EXPANDED EDIT FORM ===== */}
        {isExpanded && (
          <View style={{ marginTop: 14 }}>
            <TextInput
              value={item.name}
              onChangeText={(v) => updateField(item.id, "name", v)}
              placeholder="Product name"
              style={styles.input}
            />

            <TextInput
              value={item.description}
              onChangeText={(v) =>
                updateField(item.id, "description", v)
              }
              placeholder="Description"
              style={styles.input}
            />

            <TextInput
              value={item.price}
              onChangeText={(v) => updateField(item.id, "price", v)}
              placeholder="Price"
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              value={item.category}
              onChangeText={(v) =>
                updateField(item.id, "category", v)
              }
              placeholder="Category"
              style={styles.input}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 8,
              }}
            >
              <AppText>Available</AppText>
              <Switch
                value={item.isAvailable}
                onValueChange={(v) =>
                  updateField(item.id, "isAvailable", v)
                }
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setExpandedId(null)}
                style={styles.cancelBtn}
              >
                <AppText style={{ color: "#374151" }}>Cancel</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => saveProduct(item)}
                style={styles.saveBtn}
              >
                <AppText style={{ color: "#FFFFFF" }}>Save</AppText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB", paddingTop: 40 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchProducts}
      />

      {/* ===== ADD PRODUCT BUTTON ===== */}
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
          <AppText
            style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}
          >
            + Add New Product
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ================= STYLES ================= */
const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: "#FF6B35",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  cancelBtn: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
};

export default Products;
