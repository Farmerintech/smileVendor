import { useStatusBar } from "@/hooks/statusBar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
        console.log(data, storeData)
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
        <ActivityIndicator size="large" color={"orange"}/>
      </View>
    );
  }

  // Conditional render
  return !store?.id ? <CreateStoreWizard /> : <RealHomeContent  />;
}

/* ================= REAL HOME ================= */
const STATUS_FILTERS = ["ongoing", "in-transit", "awaiting-bike", "canceled", "completed"];

// Frontend-friendly status filters
      // let statusQuery = 

// Map backend DB status to frontend label using switch
const statusQuery = (status:string): string => {
  switch (status) {
    case "pending":
    case "preparing":
      return "ongoing"; // everything that is not ready/picked_up/delivered/cancelled is ongoing
    case "ready":
      return "awaiting-bike"; // customer waiting for rider
    case "picked_up":
      return "in-transit"; // rider has picked the order
    case "delivered":
      return "completed"; // delivered orders
    case "cancelled":
      return "canceled"; // cancelled orders
    default:
      return "ongoing"; // fallback
  }
};

export const RealHomeContent = () => {
  const { user } = useAppStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("ongoing");
  const [error, setError] = useState<string | null>(null);
  const { vendor, setVendorStore,  } = useAppStore();
  const [storeId, setStoreId] = useState()
 const fetchOrders = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${BaseURL}/store/get_store`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    const data = await res.json();
    const storeData = data?.data;

    if (!storeData) {
      Alert.alert("No Store", "No store found for this account.");
      setLoading(false);
      return;
    }

    // Set storeId in state if needed
    setStoreId(storeData.id);

    // Use storeData.id directly instead of state
    const staus = statusQuery(selectedStatus);
    const ordersRes = await fetch(
      `${BaseURL}/orders/get_store_orders/${storeData.id}`,
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

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>Order #{item.id}</Text>
      <Text>Customer: {item?.customerName}</Text>
      <Text>Total: ${item?.totalAmount}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Date: {new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>Store: {vendor.store.name}</Text>

      <View style={styles.filterContainer}>
                {/* Time Filter */}
                <FlatList
                  horizontal
                  data={STATUS_FILTERS}
                  keyExtractor={(item) => item}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, marginBottom: 16 }}
                  renderItem={({ item, index }) => {
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
                          {item}
                        </AppText>
                      </TouchableOpacity>
                    );
                  }}
                />
        
        {/* {STATUS_FILTERS.map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterBtn, selectedStatus === status && styles.filterBtnActive]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text style={selectedStatus === status ? styles.filterTextActive : styles.filterText}>
              {status.replace("-", " ").toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))} */}
      </View>

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
  filterContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16, gap: 8 },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  filterBtnActive: { backgroundColor: "#000" },
  filterText: { color: "#000", fontWeight: "600" },
  filterTextActive: { color: "#fff", fontWeight: "700" },
  orderCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  orderTitle: { fontWeight: "700", fontSize: 16, marginBottom: 4 },
});
