// screens/Insight.tsx
import { useStatusBar } from "@/hooks/statusBar";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import "../../global.css";
import { AppText } from "../_layout";

const timeFilters = [
  "Today",
  "Yesterday",
  "This Week",
  "This Month",
  "Other Months",
  "This Year",
];

const popularItems = [
  { name: "Chicken Sandwich", sold: 120 },
  { name: "Burger", sold: 90 },
  { name: "Fries", sold: 70 },
];

const reviews = [
  { stars: 5, count: 50 },
  { stars: 4, count: 30 },
  { stars: 3, count: 10 },
  { stars: 2, count: 5 },
  { stars: 1, count: 2 },
];

const Insight = () => {
  const [selectedFilter, setSelectedFilter] = useState(0);
 useStatusBar("white", "dark-content");  

  // Dummy data for stats
  const totalOrders = 200;
  const totalAmount = 500000; // ₦500,000
  const averageAmount = totalAmount / totalOrders;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F9FAFB", paddingTop: 10 }}>
      {/* 1️⃣ Stats Section */}
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        {/* Time Filter */}
        <FlatList
          horizontal
          data={timeFilters}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, marginBottom: 16 }}
          renderItem={({ item, index }) => {
            const active = selectedFilter === index;
            return (
              <TouchableOpacity
                onPress={() => setSelectedFilter(index)}
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

        {/* Stats Cards */}
        <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 16,
              minWidth: 150,
            }}
          >
            <AppText style={{ fontSize: 14, color: "#6B7280" }}>Total Orders</AppText>
            <AppText style={{ fontSize: 18, fontWeight: "600", marginTop: 4 }}>
              {totalOrders}
            </AppText>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 16,
              minWidth: 150,
            }}
          >
            <AppText style={{ fontSize: 14, color: "#6B7280" }}>Total Earned</AppText>
            <AppText style={{ fontSize: 18, fontWeight: "600", marginTop: 4 }}>
              ₦{totalAmount.toLocaleString()}
            </AppText>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 16,
              minWidth: 150,
            }}
          >
            <AppText style={{ fontSize: 14, color: "#6B7280" }}>Average Order</AppText>
            <AppText style={{ fontSize: 18, fontWeight: "600", marginTop: 4 }}>
              ₦{averageAmount.toFixed(0).toLocaleString()}
            </AppText>
          </View>
        </View>
      </View>

      {/* 2️⃣ Most Popular Items Table */}
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <AppText style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
          Most Popular Items
        </AppText>

        {/* Table Header */}
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
          <AppText style={{ flex: 1, fontWeight: "600", fontSize: 14 }}>Item</AppText>
          <AppText style={{ flex: 1, fontWeight: "600", fontSize: 14, textAlign: "right" }}>Sold</AppText>
        </View>

        {/* Table Rows */}
        {popularItems.map((item, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              alignItems: "center",
            }}
          >
            <AppText style={{ flex: 1, fontSize: 14 }}>{item.name}</AppText>
            <AppText style={{ flex: 1, fontSize: 14, fontWeight: "600", textAlign: "right" }}>
              {item.sold}
            </AppText>
          </View>
        ))}
      </View>

      {/* 3️⃣ Reviews Table */}
      <View style={{ paddingHorizontal: 16, marginBottom: 30 }}>
        <AppText style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
          Reviews
        </AppText>

        {/* Table Header */}
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
          <AppText style={{ flex: 1, fontWeight: "600", fontSize: 14 }}>Stars</AppText>
          <AppText style={{ flex: 1, fontWeight: "600", fontSize: 14, textAlign: "right" }}>Count</AppText>
        </View>

        {/* Table Rows */}
        {reviews.map((r) => (
          <View
            key={r.stars}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 6 }}>
              <AppText style={{ fontSize: 14 }}>{r.stars} Star</AppText>
              <Ionicons name="star" size={14} color="#FFB800" />
            </View>
            <AppText style={{ flex: 1, fontSize: 14, fontWeight: "600", textAlign: "right" }}>
              {r.count}
            </AppText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Insight;
