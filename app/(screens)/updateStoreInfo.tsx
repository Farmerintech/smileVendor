import { useStatusBar } from "@/hooks/statusBar";
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
import { BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";

/* =====================================================
   MAIN PAGE
===================================================== */
export default function StoreProfile() {
  const { user } = useAppStore();
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

  useStatusBar("white", "dark-content");

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
     UPDATE STORE
  ====================================================== */
  const submitUpdate = async () => {
    if (!store?.id) return;

    setLoading(true);
    try {
      const res = await fetch(`${BaseURL}/store/update_store/${store.id}`, {
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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Store Information</Text>

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
          <View key={i} style={{ marginBottom: 10 }}>
            <Input
              label={`Address ${i + 1}`}
              v={addr}
              c={(v: string) => updateAddress(i, v)}
            />
            <TouchableOpacity onPress={() => removeAddress(i)}>
              <Text style={{ color: "red" }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addAddress}>
          <Text style={{ color: "#093131", fontWeight: "700" }}>
            + Add address
          </Text>
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
        <Input label="Opening Days (comma separated)" v={form.openingDays.join(", ")} c={(v: string) => update({ openingDays: v.split(",").map(x => x.trim()) })} />
        <Input label="Opening Time" v={form.openingTime} c={(v: string) => update({ openingTime: v })} />
        <Input label="Closing Time" v={form.closingTime} c={(v: string) => update({ closingTime: v })} />
      </Section>

      <TouchableOpacity style={styles.submit} onPress={submitUpdate}>
        <Text style={styles.submitText}>
          {loading ? "Updating..." : "Update Store"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* =====================================================
   SMALL REUSABLES
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
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: "800", marginBottom: 16 },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: { fontWeight: "700", marginBottom: 10 },
  label: { fontSize: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  submit: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});
