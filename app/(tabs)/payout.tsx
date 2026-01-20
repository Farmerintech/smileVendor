// screens/Payout.tsx
import { useStatusBar } from "@/hooks/statusBar";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import "../../global.css";
import { AppText } from "../_layout";

// Dummy payout history
const payoutHistory = [
  { id: "1", amount: 50000, date: "2026-01-20", status: "Paid" },
  { id: "2", amount: 75000, date: "2026-01-18", status: "Pending" },
  { id: "3", amount: 120000, date: "2026-01-15", status: "Failed" },
  { id: "4", amount: 30000, date: "2026-01-12", status: "Paid" },
  { id: "5", amount: 45000, date: "2026-01-10", status: "Paid" },
];

const statusOptions = ["All", "Pending", "Paid", "Failed"];
const dateOptions = [
  "Today",
  "Yesterday",
  "This Week",
  "This Month",
  "Other Months",
  "This Year",
];

const Payout = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("This Month");
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [dateDropdown, setDateDropdown] = useState(false);

  const recentPayout = payoutHistory[0]?.amount || 0;

  // Filter payouts based on status (date filter logic can be added)
  const filteredPayouts = payoutHistory.filter((p) => {
    const statusMatch = statusFilter === "All" || p.status === statusFilter;
    const dateMatch = true; // TODO: implement actual date filter
    return statusMatch && dateMatch;
  });

  // Ensure only one dropdown is open at a time
  const toggleStatusDropdown = () => {
    setStatusDropdown(!statusDropdown);
    if (!statusDropdown) setDateDropdown(false);
  };

  const toggleDateDropdown = () => {
    setDateDropdown(!dateDropdown);
    if (!dateDropdown) setStatusDropdown(false);
  };
 useStatusBar("white", "dark-content");  

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB", paddingTop: 10 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 50 }}
      >
        {/* ================= RECENT PAYOUT ================= */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <AppText style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            Recent Payout
          </AppText>
          <AppText style={{ fontSize: 26, fontWeight: "bold", color: "#093131" }}>
            ₦{recentPayout.toLocaleString()}
          </AppText>
        </View>

        {/* ================= FILTER DROPDOWNS ================= */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 16, position: "relative" }}>
          {/* Status Filter */}
          <View style={{ flex: 1, zIndex: 10 }}>
            <TouchableOpacity
              onPress={toggleStatusDropdown}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <AppText>{statusFilter}</AppText>
              <Ionicons
                name={statusDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>

            {statusDropdown && (
              <View
                style={{
                  position: "absolute",
                  top: 50,
                  left: 0,
                  right: 0,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 12,
                  overflow: "hidden",
                  maxHeight: 200,
                }}
              >
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setStatusFilter(option);
                      setStatusDropdown(false);
                    }}
                    style={{
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: "#E5E7EB",
                    }}
                  >
                    <AppText>{option}</AppText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Date Filter */}
          <View style={{ flex: 1, zIndex: 5 }}>
            <TouchableOpacity
              onPress={toggleDateDropdown}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <AppText>{dateFilter}</AppText>
              <Ionicons
                name={dateDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>

            {dateDropdown && (
              <View
                style={{
                  position: "absolute",
                  top: 50,
                  left: 0,
                  right: 0,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 12,
                  overflow: "hidden",
                  maxHeight: 200,
                }}
              >
                {dateOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setDateFilter(option);
                      setDateDropdown(false);
                    }}
                    style={{
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: "#E5E7EB",
                    }}
                  >
                    <AppText>{option}</AppText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* ================= PAYOUT HISTORY ================= */}
        <View style={{ marginBottom: 30 }}>
          <AppText style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
            Payout History
          </AppText>

          {filteredPayouts.length === 0 ? (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
              }}
            >
              <Ionicons name="wallet-outline" size={50} color="#9CA3AF" />
              <AppText style={{ marginTop: 10, color: "#6B7280" }}>
                No payout history
              </AppText>
            </View>
          ) : (
            <PayoutTable payouts={filteredPayouts} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Payout;

// ================= PAYOUT TABLE COMPONENT =================
export const PayoutTable = ({ payouts }: { payouts: any[] }) => {
  return (
    <ScrollView
      style={{ flex: 1, padding: 6 }}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {/* Header Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          marginBottom: 8,
        }}
      >
        <AppText style={{ flex: 1, fontWeight: "600", fontSize: 14 }}>Date</AppText>
        <AppText style={{ flex: 1, fontWeight: "600", fontSize: 14, textAlign: "center" }}>Amount</AppText>
        <AppText style={{ flex: 1, fontWeight: "600", fontSize: 14, textAlign: "right" }}>Status</AppText>
      </View>

      {/* Table Rows */}
      {payouts.map((payout) => {
        const statusColor =
          payout.status.toLowerCase() === "paid"
            ? "#16A34A"
            : payout.status.toLowerCase() === "pending"
            ? "#F59E0B"
            : "#EF4444";

        return (
          <View
            key={payout.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#FFFFFF",
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              alignItems: "center",
            }}
          >
            {/* Date */}
            <AppText style={{ flex: 1, fontSize: 14, color: "#6B7280" }}>
              {payout.date}
            </AppText>

            {/* Amount */}
            <AppText style={{ flex: 1, fontSize: 14, fontWeight: "600", textAlign: "center" }}>
              ₦{payout.amount.toLocaleString()}
            </AppText>

            {/* Status */}
            <AppText
              style={{
                flex: 1,
                fontSize: 14,
                textAlign: "right",
                color: statusColor,
                fontWeight: "500",
              }}
            >
              {payout.status.toUpperCase()}
            </AppText>
          </View>
        );
      })}
    </ScrollView>
  );
};
