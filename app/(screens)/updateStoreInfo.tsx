import { useStatusBar } from "@/hooks/statusBar";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppTextBold } from "../_layout";
import { BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";

/* =====================================================
   CONSTANTS
===================================================== */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* =====================================================
   MAIN PAGE
===================================================== */
export default function StoreProfile() {
  const { user, vendor } = useAppStore();
  const mystore = vendor?.store;
 useStatusBar("#093131", "light-content");  

  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState<any | null>(null);

  const [form, setForm] = useState<any>({
    name: "",
    description: "",
    officialEmail: "",
    officialPhone: "",
    vendorType: "",
    deliveryType: "",
    addresses: [],
    bankName: "",
    accountNumber: "",
    accountName: "",
    openingDays: [],
    openingTime: "",
    closingTime: "",
  });

  // useStatusBar("white", "dark-content");

  /* =====================================================
     FETCH STORE
  ====================================================== */
  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BaseURL}/store/get_store`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        const storeData = data?.data;

        if (!storeData) {
          Alert.alert("No Store", "No store found for this account.");
          return;
        }
              (storeData)
        setStore(storeData);
        setForm({
          name: storeData.name ?? "",
          description: storeData.description ?? "",
          officialEmail: storeData.officialEmail ?? "",
          officialPhone: storeData.officialPhone ?? "",
          vendorType: storeData.vendorType ?? "",
          deliveryType: storeData.deliveryType ?? "",
          addresses: storeData.addresses ?? [],
          bankName: storeData.bankName ?? "",
          accountNumber: storeData.accountNumber ?? "",
          accountName: storeData.accountName ?? "",
          openingDays: storeData.openingDays ?? [],
          openingTime: storeData.openingTime ?? "",
          closingTime: storeData.closingTime ?? "",
        });
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to fetch store");
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  const update = (data: any) =>
    setForm((prev: any) => ({ ...prev, ...data }));

  /* =====================================================
     ADDRESS HELPERS
  ====================================================== */
  const updateAddress = (index: number, value: string) => {
    const copy = [...form.addresses];
    copy[index] = value;
    update({ addresses: copy });
  };

  const addAddress = () => {
    update({ addresses: [...form.addresses, ""] });
  };

  const removeAddress = (index: number) => {
    update({
      addresses: form.addresses.filter((_: any, i: number) => i !== index),
    });
  };

  /* =====================================================
     OPENING DAYS TOGGLE
  ====================================================== */
  const toggleDay = (day: string) => {
    setForm((prev: any) => {
      const exists = prev.openingDays.includes(day);
      return {
        ...prev,
        openingDays: exists
          ? prev.openingDays.filter((d: string) => d !== day)
          : [...prev.openingDays, day],
      };
    });
  };

  /* =====================================================
     UPDATE STORE
  ====================================================== */
  const submitUpdate = async () => {
    if (!store?.id) return;

    setLoading(true);
    try {
      const res = await fetch(`${BaseURL}/store/edit_store/${mystore.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");

      Alert.alert("Success", "Store updated successfully");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RENDER
  ====================================================== */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#093131" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        {/* HEADER */}
        <View style={styles.headerWrap}>
          {/* <View className="px-5 py-8 flex flex-row gap-8 items-center">
            <Ionicons name="chevron-back" size={20} color="white"/>

          </View> */}
          <View style={styles.headerInner}>
            <View style={styles.storeIcon}>
              <Ionicons
                name="storefront-outline"
                size={56}
                color="#1EBA8D"
              />
            </View>

            <View style={{ flex: 1 }}>
              <AppTextBold style={styles.storeName}>
                {mystore?.name}
              </AppTextBold>
              <Text style={styles.storeId}>ID: {mystore?.id}</Text>
            </View>
          </View>
        </View>
<View   style={{
          flex: 3,
          backgroundColor: "#FFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingHorizontal: 2,
          paddingTop: 32,
        }}>
        {/* CONTENT */}
        <View style={styles.content}>
          {/* Store Info */}
          <Section title="Store Details">
            <Input label="Store Name" v={form.name} c={(v: string) => update({ name: v })} />
            <Input label="Description" v={form.description} c={(v: string) => update({ description: v })} />
            <Input label="Official Email" v={form.officialEmail} c={(v: string) => update({ officialEmail: v })} />
            <Input label="Official Phone" v={form.officialPhone} c={(v: string) => update({ officialPhone: v })} />
            <Input label="Vendor Type" v={form.vendorType} c={(v: string) => update({ vendorType: v })} />
            <Input label="Delivery Type" v={form.deliveryType} c={(v: string) => update({ deliveryType: v })} />
          </Section>

          {/* Addresses */}
          <Section title="Addresses">
            {form.addresses.map((addr: string, i: number) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <Input
                  label={`Address ${i + 1}`}
                  v={addr}
                  c={(v: string) => updateAddress(i, v)}
                />
                <TouchableOpacity onPress={() => removeAddress(i)}>
                  <Text style={{ color: "red", fontSize: 12 }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={addAddress}>
              <Text style={styles.addText}>+ Add address</Text>
            </TouchableOpacity>
          </Section>

          {/* Bank */}
          <Section title="Bank Information">
            <Input label="Bank Name" v={form.bankName} c={(v: string) => update({ bankName: v })} />
            <Input label="Account Number" v={form.accountNumber} c={(v: string) => update({ accountNumber: v })} />
            <Input label="Account Name" v={form.accountName} c={(v: string) => update({ accountName: v })} />
          </Section>

          {/* Operations */}
          <Section title="Operations">
            <Text style={styles.label}>Opening Days</Text>

            <View style={styles.daysWrap}>
              {DAYS.map((day) => {
                const active = form.openingDays.includes(day);
                return (
                  <TouchableOpacity
                    key={day}
                    onPress={() => toggleDay(day)}
                    style={[
                      styles.dayBtn,
                      active && styles.dayBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        active && styles.dayTextActive,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Input
              label="Opening Time"
              v={form.openingTime}
              c={(v: string) => update({ openingTime: v })}
            />
            <Input
              label="Closing Time"
              v={form.closingTime}
              c={(v: string) => update({ closingTime: v })}
            />
          </Section>

          {/* SUBMIT */}
          <TouchableOpacity
            style={styles.submit}
            onPress={submitUpdate}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? "Updating..." : "Update Store"}
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =====================================================
   SMALL COMPONENTS
===================================================== */
const Section = ({ title, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Input = ({ label, v, c }: any) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput value={v} onChangeText={c} style={styles.input} />
  </View>
);

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  headerWrap: {
    backgroundColor: "",
    paddingVertical: 30,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16,
  },
  storeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(30,186,141,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  storeName: {
    fontSize: 26,
    color: "#fff",
  },
  storeId: {
    color: "#fff",
    fontSize: 11,
    marginTop: 4,
  },
  content: {
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  addText: {
    color: "#093131",
    fontWeight: "700",
    marginTop: 6,
  },
  daysWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  dayBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  dayBtnActive: {
    backgroundColor: "#093131",
    borderColor: "#093131",
  },
  dayText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  dayTextActive: {
    color: "#fff",
  },
  submit: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});
