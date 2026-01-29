import { RejectionReasonModal } from "@/components/rejectionNote";
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

/* ================= HOME ================= */
export default function HomePage() {
  const { setVendorStore, user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<any>(null);

  useStatusBar("white", "dark-content");

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
        setStore(data?.data || null);
        if (data?.data) await setVendorStore(data.data);
      } catch (err) {
        console.error("FETCH STORE ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [User?.id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return !store?.id ? <CreateStoreWizard /> : <RealHomeContent />;
}

/* ================= REAL HOME ================= */

const STATUS_FILTERS = [
  "ongoing",
  "preparing",
  "awaiting-bike",
  "picked-up",
  "rejected",
  "completed",
];

export const RealHomeContent = () => {
  const { user, vendor } = useAppStore();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("ongoing");
  const [storeData, setStoreData] = useState<any>(null);

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BaseURL}/store/get_store`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const store = (await res.json())?.data;
      if (!store) throw new Error("Store not found");

      setStoreData(store);

      const ordersRes = await fetch(
        `${BaseURL}/orders/get_orders_by_storeId/${store.id}/${selectedStatus}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const ordersData = await ordersRes.json();
      if (!ordersRes.ok)
        throw new Error(ordersData?.message || "Failed to fetch orders");

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

  const updateOrderStatus = async (
    orderId: string,
    status: string,
    rejectionNote?: string,
    isRejected?:boolean
  ) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BaseURL}/orders/update_order/${storeData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ orderId, status, rejectionNote, isRejected }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");

      Alert.alert(data.message);
      fetchOrders();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmit = (reason: string) => {
    if (!selectedOrderId) return;
    setShowRejectModal(false);
    updateOrderStatus(selectedOrderId, "rejected", reason, true);
    setSelectedOrderId(null);
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const isOngoing = item.orderStatusVendor === "ongoing";
    const isPreparing = item.orderStatusVendor === "preparing";
    const isAwaiting = item.orderStatusVendor === "awaiting-bike";

    return (
      <View style={styles.orderCard}>
        {item.items.map((product: any, index: number) => (
          <View
            key={index}
            style={{ flexDirection: "row", marginBottom: 12 }}
          >
            <Image
              source={{ uri: product.imageUrl }}
              style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600" }}>{product.name}</Text>
              <Text>Qty: {product.quantity}</Text>
              <Text>₦{product.price}</Text>
            </View>
          </View>
        ))}

        <Text>Status: {item.orderStatusVendor}</Text>
        {item.isRejected && <Text>Rejection Note:{item.rejectionNote}</Text>}
        <Text>Total: ₦{item.totalAmount}</Text>

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
              onPress={() => {
                setSelectedOrderId(item.id);
                setShowRejectModal(true);
              }}
            >
              <Text style={styles.btnText}>Reject Order</Text>
            </Pressable>
          </View>
        )}

        {isPreparing && (
          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionBtn, styles.acceptBtn]}
              onPress={() => updateOrderStatus(item.id, "awaiting-bike")}
            >
              <Text style={styles.btnText}>Ready for Pickup</Text>
            </Pressable>
          </View>
        )}

        {isAwaiting && (
          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionBtn, styles.acceptBtn]}
              onPress={() => updateOrderStatus(item.id, "picked-up")}
            >
              <Text style={styles.btnText}>Picked Up</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
      ) : orders.length === 0 ? (
        <Text style={{ marginTop: 20, textAlign: "center" }}>
          No orders found for this status.
        </Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <RejectionReasonModal
        visible={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleRejectSubmit}
      />
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
    borderWidth: 1,
    borderColor: "#ddd",
  },
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
