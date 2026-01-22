import { create } from "zustand";
import { getSecureItem, removeSecureItem, setSecureItem } from "../lib/secureStorage";

/* ================= TYPES ================= */

export type StoreInfo = {
  name: string;
  description: string;
  coverImage?: string;
  officialEmail: string;
  officialPhone: string;
  addresses:string[];
  vendorType: "restaurant" | "supermarket" | "pharmacy" | "supplier" | "groceries";
  deliveryType: "instant" | "preorder" | "instant & preorder";
};

export type AccountInfo = {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
};

export type StoreOperations = {
  openingDays: string[];
  openingTime?: string;
  closingTime?: string;
};

export type StoreAddress = {
  street?: string;
  city?: string;
  state?: string;
  lat?: number;
  long?: number;
};

export type VendorState = {
  storeInfo: Partial<StoreInfo>;
  accountInfo: Partial<AccountInfo>;
  operations: Partial<StoreOperations>;
  address: Partial<StoreAddress>;
  loading: boolean;

  // actions
  hydrate: () => Promise<void>;
  setStoreInfo: (data: Partial<StoreInfo>) => Promise<void>;
  setAccountInfo: (data: Partial<AccountInfo>) => Promise<void>;
  setOperations: (data: Partial<StoreOperations>) => Promise<void>;
  setAddress: (data: Partial<StoreAddress>) => Promise<void>;
  reset: () => Promise<void>;
};

/* ================= STORE ================= */

export const useVendorStore = create<VendorState>((set, get) => ({
  storeInfo: {},
  accountInfo: {},
  operations: {},
  address: {},
  loading: true,

  /* 🔄 Hydrate from secure storage */
  hydrate: async () => {
    const storeInfo = await getSecureItem<Partial<StoreInfo>>("vendor_storeInfo");
    const accountInfo = await getSecureItem<Partial<AccountInfo>>("vendor_accountInfo");
    const operations = await getSecureItem<Partial<StoreOperations>>("vendor_operations");
    const address = await getSecureItem<Partial<StoreAddress>>("vendor_address");

    set({
      storeInfo: storeInfo ?? {},
      accountInfo: accountInfo ?? {},
      operations: operations ?? {},
      address: address ?? {},
      loading: false,
    });
  },

  /* 🏪 SECTION A */
  setStoreInfo: async (data) => {
    const updated = { ...get().storeInfo, ...data };
    set({ storeInfo: updated });
    await setSecureItem("vendor_storeInfo", updated);
  },

  /* 💳 SECTION B */
  setAccountInfo: async (data) => {
    const updated = { ...get().accountInfo, ...data };
    set({ accountInfo: updated });
    await setSecureItem("vendor_accountInfo", updated);
  },

  /* ⚙ SECTION C */
  setOperations: async (data) => {
    const updated = { ...get().operations, ...data };
    set({ operations: updated });
    await setSecureItem("vendor_operations", updated);
  },

  /* 🏠 SECTION D */
  setAddress: async (data) => {
    const updated = { ...get().address, ...data };
    set({ address: updated });
    await setSecureItem("vendor_address", updated);
  },

  /* 🚪 RESET / LOGOUT */
  reset: async () => {
    set({
      storeInfo: {},
      accountInfo: {},
      operations: {},
      address: {},
    });

    await removeSecureItem("vendor_storeInfo");
    await removeSecureItem("vendor_accountInfo");
    await removeSecureItem("vendor_operations");
    await removeSecureItem("vendor_address");
  },
}));
