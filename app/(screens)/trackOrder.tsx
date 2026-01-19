import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppText, AppTextBold } from "../_layout";

// Steps of the order
const orderSteps = [
  { id: "1", title: "Order received by vendor", key: "receivedV" },
  { id: "2", title: "Order picked by rider", key: "picked" },
  { id: "3", title: "Rider on the way for pickup", key: "pickedUp" },
  { id: "4", title: "Order confirmed by vendor", key: "confirmed" },
  { id: "5", title: "Order received by you", key: "receivedY" },
];

export default function TrackOrder() {
  // Tab state: ongoing or completed
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">("ongoing");

  // Track state for each step
  const [track, setTrack] = useState({
    receivedV: false,
    picked: false,
    pickedUp: false,
    confirmed: false,
    receivedY: false,
  });

  // Completed is true when last step is done
  const completed = track.receivedY;

  // Send push notification
  async function sendNotification(title: string, text: string) {
    await Notifications.scheduleNotificationAsync({
      content: { title, body: text, sound: "default" },
      trigger: null, // immediate
    });
  }

  // Simulate order progression
  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setTrack((p) => ({ ...p, receivedV: true }));
        sendNotification("Order received", "Vendor has received your order");
      }, 2000),

      setTimeout(() => {
        setTrack((p) => ({ ...p, picked: true }));
        sendNotification("Rider assigned", "Your order has been picked by the rider");
      }, 7000),

      setTimeout(() => {
        setTrack((p) => ({ ...p, pickedUp: true }));
        sendNotification("Rider on the way", "Rider is heading for pickup");
      }, 12000),

      setTimeout(() => {
        setTrack((p) => ({ ...p, confirmed: true }));
        sendNotification("Order confirmed", "Vendor has confirmed your order");
      }, 17000),

      setTimeout(() => {
        setTrack((p) => ({ ...p, receivedY: true }));
        sendNotification("Delivered 🎉", "You have received your order");
      }, 22000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Ongoing Orders */}
      {activeTab === "ongoing" && !completed && (
        <FlatList
          data={orderSteps}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isLast = index === orderSteps.length - 1;
            const isActive = track[item.key as keyof typeof track];
            const next = orderSteps[index + 1];
            const connectorActive =
              isActive || (next && track[next.key as keyof typeof track]);

            return (
              <View style={styles.row}>
                {/* Timeline */}
                <View style={styles.timeline}>
                  <View
                    style={[styles.dot, isActive ? styles.dotActive : styles.dotInactive]}
                  >
                    {isActive && (
                      <Ionicons name="checkmark" size={14} color="#093131" />
                    )}
                  </View>

                  {!isLast && (
                    <View
                      style={[styles.connector, connectorActive && styles.connectorActive]}
                    />
                  )}
                </View>

                {/* Step text */}
                <View style={styles.content}>
                  <AppTextBold style={[styles.title, isActive && styles.titleActive]}>
                    {item.title}
                  </AppTextBold>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* No ongoing orders */}
      {activeTab === "ongoing" && completed && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No ongoing orders...!</Text>
        </View>
      )}

      {/* Completed Orders */}
      {activeTab === "completed" && completed && (
        <View style={styles.emptyContainer}>
          <Text style={styles.completedText}>🎉 Order Completed Successfully</Text>
        </View>
      )}

      {/* Completed tab pressed but order not yet completed */}
      {activeTab === "completed" && !completed && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Order is still in progress...</Text>
        </View>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "",
    paddingHorizontal: 14,
    paddingTop: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  timeline: {
    width: 30,
    alignItems: "center",
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dotActive: {
    borderColor: "#093131",
    borderWidth: 2,
    backgroundColor: "#E6F2F2",
  },
  dotInactive: {
    borderColor: "#D1D5DB",
    borderWidth: 2,
  },
  connector: {
    width: 2,
    height: 40,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginTop: 6,
  },
  connectorActive: {
    borderColor: "#093131",
  },
  content: {
    flex: 1,
    paddingLeft: 12,
    paddingTop: 2,
  },
  title: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  titleActive: {
    color: "#111827",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  completedText: {
    fontSize: 16,
    color: "#16A34A",
    fontWeight: "600",
  },
});

// Tabs Component
type Props = {
  activeTab: "ongoing" | "completed";
  setActiveTab: (tab: "ongoing" | "completed") => void;
};

export const OrderTabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        padding: 4,
        marginHorizontal: 14,
        marginBottom: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => setActiveTab("ongoing")}
        style={{
          flex: 1,
          paddingVertical: 10,
          borderRadius: 12,
          backgroundColor: activeTab === "ongoing" ? "#FFFFFF" : "transparent",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: activeTab === "ongoing" ? 0.1 : 0,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
        }}
      >
        <AppText
          style={{
            fontSize: 14,
            fontWeight: activeTab === "ongoing" ? "600" : "400",
            color: activeTab === "ongoing" ? "#111827" : "#6B7280",
          }}
        >
          Ongoing Orders
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setActiveTab("completed")}
        style={{
          flex: 1,
          paddingVertical: 10,
          borderRadius: 12,
          backgroundColor: activeTab === "completed" ? "#FFFFFF" : "transparent",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: activeTab === "completed" ? 0.1 : 0,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: activeTab === "completed" ? "600" : "400",
            color: activeTab === "completed" ? "#111827" : "#6B7280",
          }}
        >
          Completed Orders
        </Text>
      </TouchableOpacity>
    </View>
  );
};
