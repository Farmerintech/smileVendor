import { useStatusBar } from "@/hooks/statusBar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CreateStoreWizard from "../(screens)/storeInfo";
import { AppText } from "../_layout";
import { BaseURL } from "../lib/api";
import { getUserFromToken } from "../lib/jwt";
import { useAppStore } from "../store/useAppStore";

export default function HomePage() {
  const { vendor, setVendorStore, user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<any>(null); // single store object
  useStatusBar("white", "dark-content");

  // Extract user ID from token
  const User = getUserFromToken(user?.token || "");

  useEffect(() => {
    const fetchStore = async () => {
      if (!User?.id) return;

      setLoading(true);
      try {
        const res = await fetch(`${BaseURL}/store/get_store`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        const data = await res.json();
        const storeData = data?.data || null;
        // setStoreData(storeData)
        setStore(storeData); // local state
        if (storeData) {
          await setVendorStore(storeData); // sync with app store
        }
      } catch (err) {
        console.error("FETCH STORE ERROR", err);
        setStore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [User?.id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={"orange"} />
      </View>
    );
  }

  // Conditional render
  return !store?.id ? <CreateStoreWizard /> : <RealHomeContent />;
}

/* ================= REAL HOME ================= */
const STATUS_FILTERS = [
   "ongoing",
  "preparing",
  "awaiting-bike",
  "picked-up",
  "canceled",
  "completed"
];

export const RealHomeContent = () => {
  const { user, vendor } = useAppStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("ongoing");
  const [error, setError] = useState<string | null>(null);
  const [stData, setStoreData] = useState<any>()

  const fetchOrders = async () => {
    // Alert.alert(selectedStatus)
    setLoading(true);
    try {
      const res = await fetch(`${BaseURL}/store/get_store`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await res.json();
      const storeData = data?.data;
      setStoreData(storeData)
      if (!storeData) {
        Alert.alert("No Store", "No store found for this account.");
        setLoading(false);
        return;
      }

      const ordersRes = await fetch(
        `${BaseURL}/orders/get_orders_by_storeId/${storeData.id}/${selectedStatus}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const ordersData = await ordersRes.json();
      if (!ordersRes.ok) throw new Error(ordersData?.message || "Failed to fetch orders");

      setOrders(ordersData?.data || []);
    } catch (err: any) {
      console.error("FETCH ORDERS ERROR", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${BaseURL}/orders/update_order/${stData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ orderId, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");

      fetchOrders(); // Refresh orders after update
    } catch (err: any) {
      console.error("UPDATE ERROR", err);
      Alert.alert("Error", err.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };


const renderOrderItem = ({ item }: { item: any }) => {
  const isOngoing = item.orderStatusVendor === "ongoing";

  return (
    <View style={styles.orderCard}>
      {/* Map through each product in the order */}
      {item.items.map((product: any, index: number) => (
        <View 
          key={index} 
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          {/* Product Image */}
          <Image
            source={{ uri: product.imageUrl }}
            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
          />

          {/* Product Details */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "600", fontSize: 16 }}>{product.name}</Text>
            <Text>Product ID: {product.productId}</Text>
            <Text>Qty: {product.quantity}</Text>
            <Text>Price: ₦{product.price}</Text>
            {product.vendorNote ? <Text>Vendor Note: {product.vendorNote}</Text> : null}
            {product.riderNote ? <Text>Rider Note: {product.riderNote}</Text> : null}
          </View>
        </View>
      ))}

      {/* Order Info */}
      <Text>Status: {item.orderStatusVendor}</Text>
      <Text>Total: ₦{item.totalAmount}</Text>
      <Text>Date: {new Date(item.createdAt).toLocaleString()}</Text>

      {/* Action buttons for ongoing orders */}
      {isOngoing && (
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionBtn, styles.acceptBtn]}
            onPress={() => updateOrderStatus(item.id, "preparing")}
          >
            <Text style={styles.btnText}>Accept Order</Text>
          </Pressable>

          <Pressable
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => updateOrderStatus(item.id, "canceled_by_vendor")}
          >
            <Text style={styles.btnText}>Reject Order</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>Store: {vendor?.store?.name}</Text>

      <FlatList
        horizontal
        data={STATUS_FILTERS}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, marginBottom: 16 }}
        renderItem={({ item }) => {
          const active = selectedStatus === item;
          return (
            <TouchableOpacity
              onPress={() => setSelectedStatus(item)}
              style={{
                paddingHorizontal: 14,
                height: 36,
                borderRadius: 18,
                backgroundColor: active ? "#FF6B35" : "#FFFFFF",
                borderWidth: 1,
                borderColor: active ? "#FF6B35" : "#E5E7EB",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AppText
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: active ? "#FFFFFF" : "#6B7280",
                }}
              >
                {item.replace("-", " ")}
              </AppText>
            </TouchableOpacity>
          );
        }}
      />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 20 }}>
          <ActivityIndicator size="large" />
          <Text>Loading orders...</Text>
        </View>
      ) : error ? (
        <Text style={{ color: "red", marginTop: 20 }}>{error}</Text>
      ) : orders?.length === 0 ? (
        <Text style={{ marginTop: 20, textAlign: "center" }}>No orders found for this status.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  subHeader: { fontSize: 16, fontWeight: "600", marginBottom: 12, color: "#555" },
  orderCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    // borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  orderTitle: { fontWeight: "700", fontSize: 16, marginBottom: 4 },
  actionRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  acceptBtn: { backgroundColor: "#093131" },
  rejectBtn: { backgroundColor: "#500c0c" },
  btnText: { color: "#fff", fontWeight: "600" },
});
