import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import "../../global.css";
import { AppText } from "../_layout";
import { useAppStore } from "../store/useAppStore";
const Cart= require("@/assets/images/empty-cart.png")

const Order = () => {
  const { cart, addToCart, removeFromCart } = useAppStore();
  const isEmpty = cart.length === 0;

  /* ================= TOTAL ================= */
  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = cart.length > 0 ? 1000 : 0;
  const total = subTotal + deliveryFee;

  /* ================= REMOVE ITEM ================= */
const removeItem = async (id: string) => {
  await removeFromCart(id);
};

const checkOut = async () =>{
  cart.forEach(async item => {
      await removeFromCart(item.id);
  });
  router.push("/(screens)/trackOrder")
}
  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingBottom: 160, }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: 50,
          paddingBottom: 160,
          paddingHorizontal: 16,
        }}
      >
        {/* ================= CART ================= */}
        <View className="mb-5">
          <AppText className="text-black text-[24px] font-bold mb-3">
            Orders
          </AppText>

          {isEmpty ? (
            <View className="w-full h-[200px] flex items-center justify-center rounded-[25px] border border-gray-200">
              <Ionicons name="cart-outline" size={50} />
              <AppText>Your cart is currently empty</AppText>
            </View>
          ) : (
            <View className="gap-4">
              {cart.map((item) => (
                <View
                  key={item.id}
                  className="flex-row items-center gap-4 p-4 rounded-[20px] border border-gray-200"
                >
                  {/* Image */}
                  {item.image && (
                    <Image
                      source={item.image || Cart}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 14,
                      }}
                    />
                  )}

                  {/* Info */}
                  <View className="flex-1">
                    <AppText className="text-[16px] font-semibold text-black">
                      {item.name}
                    </AppText>

                    <AppText className="text-gray-500 text-[14px]">
                      ₦{item.price} × {item.quantity}
                    </AppText>
                  </View>

                  {/* Price */}
                  <AppText className="text-black font-bold">
                    ₦{item.price * item.quantity}
                  </AppText>

                  {/* Remove */}
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ================= CONTINUE ================= */}
        <View className="mb-5">
          <AppText className="text-black text-[26px] font-bold mb-2">
            Continue your Orders
          </AppText>

          <View className="w-full h-[200px] rounded-[25px] border border-gray-200 flex items-center justify-center">
            <Ionicons name="bag-outline" size={50} />
            <AppText>No Order in progress..</AppText>
          </View>
        </View>
      </ScrollView>

      {/* ================= CHECKOUT ================= */}
      {!isEmpty && (
        <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-gray-200">
          <View className="flex-row justify-between mb-2">
            <AppText>Subtotal</AppText>
            <AppText>₦{subTotal}</AppText>
          </View>

          <View className="flex-row justify-between mb-2">
            <AppText>Delivery</AppText>
            <AppText>₦{deliveryFee}</AppText>
          </View>

          <View className="flex-row justify-between mb-4">
            <AppText className="font-bold">Total</AppText>
            <AppText className="font-bold">₦{total}</AppText>
          </View>

          <TouchableOpacity className="bg-[#093131] py-4 rounded-[16px] items-center" onPress={()=>checkOut()}>
            <AppText className="text-white font-semibold text-[16px]">
              Checkout ₦{total}
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Order;
