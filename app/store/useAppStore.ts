import * as Location from "expo-location";
import { create } from "zustand";
import { getSecureItem, removeSecureItem, setSecureItem } from "../lib/secureStorage";

/* ================= TYPES ================= */

export type LocationType = {
  latitude: number;
  longitude: number;
};

/* ---------- USER (VENDOR AUTH) ---------- */
export type User = {
  id: string;
  // username?:string;
  email: string;
  token?: string;
  isLoggedIn: boolean;
};

/* ---------- VENDOR ---------- */
export type VendorProfile = {
  fullName: string;
  email: string;
  phone: string;
  image?: string;
};

export type StoreType = any; // replace with your real store type

export type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

export type VendorOrderStatus =
  | "ongoing"
  | "completed"
  | "cancelled";

export type VendorOrder = {
  id: string;
  status: VendorOrderStatus;
  riderId?: string;
};

export type VendorState = {
  profile: VendorProfile | null;
  store: StoreType | null;
  products: Product[];
  orders: VendorOrder[];
};

/* ================= APP STATE ================= */

export type AppState = {
  user: User;
  vendor: VendorState;

  location: LocationType | null;
  loading: boolean;
  hasCompletedOnboarding: boolean;

  hydrate: () => Promise<void>;

  setUser: (user: User) => Promise<void>;

  setVendorProfile: (profile: VendorProfile) => Promise<void>;
  setVendorStore: (store: StoreType | null) => Promise<void>;
  setVendorProducts: (products: Product[]) => Promise<void>;
  setVendorOrders: (orders: VendorOrder[]) => Promise<void>;

  refreshLocation: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  logout: () => Promise<void>;
};

/* ================= DEFAULTS ================= */

const defaultUser: User = {
  id: "",
  email: "",
  token: undefined,
  isLoggedIn: false,
};

const defaultVendorState: VendorState = {
  profile: null,
  store: null,
  products: [],
  orders: [],
};

/* ================= STORE ================= */

export const useAppStore = create<AppState>((set, get) => ({
  user: defaultUser,
  vendor: defaultVendorState,

  location: null,
  loading: true,
  hasCompletedOnboarding: false,

  /* 🔄 HYDRATE */
  hydrate: async () => {
    const user = await getSecureItem<User>("user");
    const vendor = await getSecureItem<VendorState>("vendor");
    const hasCompletedOnboarding =
      await getSecureItem<boolean>("hasCompletedOnboarding");

    set({
      user: user ?? defaultUser,
      vendor: vendor ?? defaultVendorState,
      hasCompletedOnboarding: hasCompletedOnboarding ?? false,
      loading: false,
    });
  },

  /* 👤 USER (AUTH) */
  setUser: async (user) => {
    set({ user });
    await setSecureItem("user", user);
  },

  /* 🏪 VENDOR */
  setVendorProfile: async (profile) => {
    set((state) => ({
      vendor: { ...state.vendor, profile },
    }));
    await setSecureItem("vendor", get().vendor);
  },

  setVendorStore: async (store) => {
    set((state) => ({
      vendor: { ...state.vendor, store },
    }));
    await setSecureItem("vendor", get().vendor);
  },

  setVendorProducts: async (products) => {
    set((state) => ({
      vendor: { ...state.vendor, products },
    }));
    await setSecureItem("vendor", get().vendor);
  },

  setVendorOrders: async (orders) => {
    set((state) => ({
      vendor: { ...state.vendor, orders },
    }));
    await setSecureItem("vendor", get().vendor);
  },

  /* 📍 LOCATION */
  refreshLocation: async () => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const pos = await Location.getCurrentPositionAsync({});
    const location = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };

    set({ location });
    await setSecureItem("location", location);
  },

  /* 🚀 ONBOARDING */
  completeOnboarding: async () => {
    set({ hasCompletedOnboarding: true });
    await setSecureItem("hasCompletedOnboarding", true);
  },

  /* 🚪 LOGOUT */
  logout: async () => {
    set({
      user: defaultUser,
      vendor: defaultVendorState,
      location: null,
      hasCompletedOnboarding: false,
    });

    await removeSecureItem("user");
    await removeSecureItem("vendor");
    await removeSecureItem("location");
    await removeSecureItem("hasCompletedOnboarding");
  },
}));
