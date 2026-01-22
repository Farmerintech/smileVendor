// import * as Location from "expo-location";
// import { create } from "zustand";
// import { getSecureItem, removeSecureItem, setSecureItem } from "../lib/secureStorage";

// /* ================= TYPES ================= */

// type LocationType = { latitude: number; longitude: number; };

// type VendorProfile = {
//   fullName: string;
//   email: string;
//   phone: string;
//   image?: string;
// };

// type Product = { id: string; name: string; price: number; image?: string };
// type VendorOrderStatus = "ongoing" | "completed" | "cancelled";
// type VendorOrder = { id: string; status: VendorOrderStatus; riderId?: string };

// type StoreType = any; // replace with your proper store type

// type VendorState = {
//   profile: VendorProfile | null;
//   store: StoreType | null;
//   products: Product[];
//   orders: VendorOrder[];
// };

// /* ================= APP STATE ================= */
// type AppState = {
//   vendor: VendorState;
//   location: LocationType | null;
//   loading: boolean;
//   hasCompletedOnboarding: boolean;

//   hydrate: () => Promise<void>;

//   setVendorProfile: (profile: VendorProfile) => Promise<void>;
//   setVendorStore: (store: StoreType) => Promise<void>;
//   setVendorProducts: (products: Product[]) => Promise<void>;
//   setVendorOrders: (orders: VendorOrder[]) => Promise<void>;

//   refreshLocation: () => Promise<void>;
//   completeOnboarding: () => Promise<void>;
//   logout: () => Promise<void>;
// };

// /* ================= DEFAULTS ================= */
// const defaultVendorState: VendorState = { profile: null, store: null, products: [], orders: [] };

// /* ================= STORE ================= */
// export const useAppStore = create<AppState>((set, get) => ({
//   vendor: defaultVendorState,
//   location: null,
//   loading: true,
//   hasCompletedOnboarding: false,

//   /* 🔄 HYDRATE */
//   hydrate: async () => {
//     const vendor = await getSecureItem<VendorState>("vendor");
//     const hasCompletedOnboarding = await getSecureItem<boolean>("hasCompletedOnboarding");

//     set({
//       vendor: vendor ?? defaultVendorState,
//       hasCompletedOnboarding: hasCompletedOnboarding ?? false,
//       loading: false,
//     });
//   },

//   /* 🏪 VENDOR */
//   setVendorProfile: async (profile) => {
//     set((state) => ({ vendor: { ...state.vendor, profile } }));
//     await setSecureItem("vendor", get().vendor);
//   },

//   setVendorStore: async (store) => {
//     set((state) => ({ vendor: { ...state.vendor, store } }));
//     await setSecureItem("vendor", get().vendor);
//   },

//   setVendorProducts: async (products) => {
//     set((state) => ({ vendor: { ...state.vendor, products } }));
//     await setSecureItem("vendor", get().vendor);
//   },

//   setVendorOrders: async (orders) => {
//     set((state) => ({ vendor: { ...state.vendor, orders } }));
//     await setSecureItem("vendor", get().vendor);
//   },

//   /* 📍 LOCATION */
//   refreshLocation: async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") return;

//     const pos = await Location.getCurrentPositionAsync({});
//     const location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
//     set({ location });
//     await setSecureItem("location", location);
//   },

//   /* 🚀 ONBOARDING */
//   completeOnboarding: async () => {
//     set({ hasCompletedOnboarding: true });
//     await setSecureItem("hasCompletedOnboarding", true);
//   },

//   /* 🚪 LOGOUT */
//   logout: async () => {
//     set({ vendor: defaultVendorState, location: null, hasCompletedOnboarding: false });
//     await removeSecureItem("vendor");
//     await removeSecureItem("location");
//     await removeSecureItem("hasCompletedOnboarding");
//   },
// }));
