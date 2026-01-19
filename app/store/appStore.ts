/* ================= ROLES ================= */

export type AppUserRole = "vendor" | "rider";

/* ================= LOCATION ================= */

type LocationType = {
  latitude: number;
  longitude: number;
};

/* ================= APP USER ================= */

type AppUser = {
  id: string;
  role: AppUserRole | null;
  isLoggedIn: boolean;
  token?: string;
};

/* ================= RIDER ================= */

type RiderProfile = {
  fullName: string;
  email: string;
  phone: string;
  image?: string;
};

type RiderOrderStatus =
  | "picked"
  | "delivering"
  | "completed"
  | "cancelled";

type RiderOrder = {
  id: string;
  status: RiderOrderStatus;
  pickupLocation: string;
  dropoffLocation: string;
};

type RiderState = {
  profile: RiderProfile | null;
  currentOrder: RiderOrder | null;
};

/* ================= VENDOR ================= */

type VendorProfile = {
  fullName: string;
  email: string;
  phone: string;
  image?: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

type VendorOrderStatus = "ongoing" | "completed" | "cancelled";

type VendorOrder = {
  id: string;
  status: VendorOrderStatus;
  riderId?: string;
};

type VendorState = {
  profile: VendorProfile | null;
  products: Product[];
  orders: VendorOrder[];
};

type AppState = {
  appUser: AppUser;
  rider: RiderState;
  vendor: VendorState;

  location: LocationType | null;
  loading: boolean;
  hasCompletedOnboarding: boolean;

  hydrate: () => Promise<void>;

  setAppUser: (user: AppUser) => Promise<void>;
  setRiderProfile: (profile: RiderProfile) => Promise<void>;
  setVendorProfile: (profile: VendorProfile) => Promise<void>;

  setRiderOrder: (order: RiderOrder | null) => Promise<void>;
  setVendorOrders: (orders: VendorOrder[]) => Promise<void>;

  setVendorProducts: (products: Product[]) => Promise<void>;

  refreshLocation: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  logout: () => Promise<void>;
};

const defaultAppUser: AppUser = {
  id: "",
  role: null,
  isLoggedIn: false,
};

const defaultRiderState: RiderState = {
  profile: null,
  currentOrder: null,
};

const defaultVendorState: VendorState = {
  profile: null,
  products: [],
  orders: [],
};

import * as Location from "expo-location";
import { create } from "zustand";
import {
    getSecureItem,
    removeSecureItem,
    setSecureItem,
} from "../lib/secureStorage";

export const useAppStore = create<AppState>((set, get) => ({
  appUser: defaultAppUser,
  rider: defaultRiderState,
  vendor: defaultVendorState,

  location: null,
  loading: true,
  hasCompletedOnboarding: false,

  /* 🔄 HYDRATE */
  hydrate: async () => {
    const appUser = await getSecureItem<AppUser>("appUser");
    const rider = await getSecureItem<RiderState>("rider");
    const vendor = await getSecureItem<VendorState>("vendor");
    const hasCompletedOnboarding =
      await getSecureItem<boolean>("hasCompletedOnboarding");

    set({
      appUser: appUser ?? defaultAppUser,
      rider: rider ?? defaultRiderState,
      vendor: vendor ?? defaultVendorState,
      hasCompletedOnboarding: hasCompletedOnboarding ?? false,
      loading: false,
    });
  },

  /* 👤 APP USER */
  setAppUser: async (user) => {
    set({ appUser: user });
    await setSecureItem("appUser", user);
  },

  /* 🚴 RIDER */
  setRiderProfile: async (profile) => {
    set((state) => ({
      rider: { ...state.rider, profile },
    }));
    await setSecureItem("rider", {
      profile,
      currentOrder: null,
    });
  },

  setRiderOrder: async (order) => {
    set((state) => ({
      rider: { ...state.rider, currentOrder: order },
    }));
    await setSecureItem("rider", {
      ...defaultRiderState,
      currentOrder: order,
    });
  },

  /* 🏪 VENDOR */
setVendorProfile: async (profile) => {
  set((state) => ({
    vendor: { ...state.vendor, profile },
  }));

  const { vendor } = get(); // ✅ get latest state
  await setSecureItem("vendor", vendor);
},

setVendorProducts: async (products) => {
  set((state) => ({
    vendor: { ...state.vendor, products },
  }));

  const { vendor } = get();
  await setSecureItem("vendor", vendor);
},

setVendorOrders: async (orders) => {
  set((state) => ({
    vendor: { ...state.vendor, orders },
  }));

  const { vendor } = get();
  await setSecureItem("vendor", vendor);
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
      appUser: defaultAppUser,
      rider: defaultRiderState,
      vendor: defaultVendorState,
      location: null,
    });

    await removeSecureItem("appUser");
    await removeSecureItem("rider");
    await removeSecureItem("vendor");
    await removeSecureItem("location");
  },
}));
