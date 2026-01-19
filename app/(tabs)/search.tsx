// screens/Search.tsx
import { data } from "@/components/data";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import "../../global.css";
import { AppText } from "../_layout";

const items = [
  "All",
  "Resturants",
  "Pharmacies",
  "Supermarket",
  "Local Markets",
  "Packages",
  "Lugage",
  "More",
];

const Search = () => {
  const [index, setIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [img, setImg] = useState<any>();
  const [price, setPrice] = useState<number>();

  const handleModalOpen = (item: any, price: number) => {
    setImg(item);
    setModalVisible(true);
    setPrice(price);
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#F9FAFB", paddingTop:40 }}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.storeId.toString()}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{
            paddingBottom: 150,
            
          }}
          ListHeaderComponent={
            <View style={{ backgroundColor: "#F9FAFB" }}>
              {/* Search + Filters */}
              <View
                style={{
                  paddingHorizontal: 18,
                  paddingTop: 10,
                  backgroundColor: "#F9FAFB",
                }}
              >
                {/* Search Input */}
                <View
  className="flex-row items-center shadow rounded-[20px] px-4 py-3 mb-4"
  style={{
    backgroundColor: "#F1F5F9", // inputBackground
  }}
>
  {/* Search Icon */}
  <Ionicons
    name="search-outline"
    size={20}
    color="#6B7280" // textSecondary
  />

  {/* Input */}
  <TextInput
    className="flex-1 mx-3 text-[15px]"
    placeholder="Search vendors around you..."
    placeholderTextColor="#9CA3AF" // textMuted
    onChangeText={() => {}}
    value=""
    style={{
      color: "#1A1A1A", // textPrimary
    }}
  />

  {/* Filter Button */}
  <TouchableOpacity
    activeOpacity={0.85}
    className="h-10 w-10 items-center justify-center rounded-full"
    style={{
      backgroundColor: "#FF6B35", // primaryOrange
    }}
  >
    <Ionicons
      name="options-outline"
      size={18}
      color="#FFFFFF"
    />
  </TouchableOpacity>
</View>

                {/* Category Pills */}
                <FlatList
                  data={items}
                  keyExtractor={(item) => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 8,
                    paddingVertical: 14,
                  }}
                  renderItem={({ item, index: i }) => {
                    const active = index === i;

                    return (
                      <TouchableOpacity
                        onPress={() => setIndex(i)}
                        style={{
                          paddingHorizontal: 14,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: active ? "#FF6B35" : "#FFFFFF",
                          borderWidth: 1,
                          borderColor: active ? "#FF6B35" : "#E5E7EB",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <AppText
                          style={{
                            fontSize: 13,
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
              </View>

              {/* Results Header */}
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: "#FFFFFF",
                  marginTop: 6,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      color: "#1A1A1A",
                    }}
                  >
                    25 Results for "Chicken"
                  </AppText>

                  <TouchableOpacity>
                    <AppText
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: "#FF6B35",
                      }}
                    >
                      Clear Search
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#E5E7EB",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Image */}
              <View
                style={{
                  width: 60,
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={item.imageUrl}
                  style={{
                    width: 50,
                    height: 50,
                    resizeMode: "cover",
                    borderRadius: 12,
                  }}
                />
              </View>

              {/* Info */}
              <TouchableOpacity
                style={{ flex: 1, marginLeft: 10 }}
                onPress={() => {
                  handleModalOpen(item.imageUrl, item.price);
                }}
              >
                <AppText
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    color: "#1A1A1A",
                  }}
                >
                  Chicken Republic - {item.name}
                </AppText>

                <AppText
                  style={{
                    fontSize: 13,
                    marginTop: 2,
                    color: "#6B7280",
                  }}
                >
                  From ₦{item.price} · 12m ride
                </AppText>
              </TouchableOpacity>

              {/* Favorite */}
              <MaterialIcons
                name="favorite-outline"
                size={22}
                color="#9CA3AF"
              />
            </View>
          )}
        />
      </View>

      {/* Cart Modal
      <CartModal
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        source={img}
        price={price || 0}
        count={0}
      /> */}
    </>
  );
};

export default Search;
