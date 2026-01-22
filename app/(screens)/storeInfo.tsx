import { NotificationBar } from "@/components/NotificationBar";
import { useStatusBar } from "@/hooks/statusBar";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../../global.css";
import { BaseURL } from "../lib/api";
import { useVendorStore } from "../store/storeState";
import { useAppStore } from "../store/useAppStore";

/* =====================================================
   SECTION CONFIG
===================================================== */
const SECTIONS = [
  {
    key: "A",
    title: "Store Information",
    weight: 50,
    fields: ["name", "description", "officialEmail", "officialPhone", "vendorType", "deliveryType", "addresses"],
  },
  {
    key: "B",
    title: "Account Details",
    weight: 25,
    fields: ["bankName", "accountNumber", "accountName"],
  },
  {
    key: "C",
    title: "Store Operations",
    weight: 25,
    fields: ["openingDays", "openingTime", "closingTime"],
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */
export default function CreateStoreWizard() {
  const {
    hydrate,
    storeInfo,
    accountInfo,
    operations,
    address,
    setStoreInfo,
    setAccountInfo,
    setOperations,
    setAddress,
  } = useVendorStore();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAppStore();
  const [message, setMessage] = useState<string>("");
  const [showNotification, setShowNotification] = useState(false);

  const [form, setForm] = useState<any>({
    storeId: "",
    name: "",
    description: "",
    officialEmail: "",
    officialPhone: "",
    vendorType: "restaurant",
    deliveryType: "instant",

    bankName: "",
    accountNumber: "",
    accountName: "",

    openingDays: [],
    openingTime: "",
    closingTime: "",

    addresses: [], // array of strings
  });

  useStatusBar("white", "dark-content");

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    setForm((prev: any) => ({
      ...prev,
      ...storeInfo,
      ...accountInfo,
      ...operations,
      ...address,
    }));
  }, [storeInfo, accountInfo, operations, address]);

  const update = (data: any) => setForm((p: any) => ({ ...p, ...data }));

  /* =====================================================
     Address Helpers
  ====================================================== */
  const updateAddress = (index: number, value: string) => {
    setForm((prev: any) => {
      const addresses = [...prev.addresses];
      addresses[index] = value;
      return { ...prev, addresses };
    });
  };

  const addAddress = () => {
    setForm((prev: any) => ({
      ...prev,
      addresses: [...prev.addresses, ""],
    }));
  };

  const removeAddress = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      addresses: prev.addresses.filter((_: any, i: number) => i !== index),
    }));
  };

  /* =====================================================
     Section / Progress Helpers
  ====================================================== */
  const sectionStatus = useMemo(() => {
    const result: Record<string, boolean> = {};
    SECTIONS.forEach((s) => {
      result[s.key] = s.fields.every((f) => {
        const v = form[f];
        if (Array.isArray(v)) return v.length > 0;
        return v !== "" && v !== null && v !== undefined;
      });
    });
    return result;
  }, [form]);

  const progress = useMemo(
    () =>
      SECTIONS.reduce(
        (sum, s) => (sectionStatus[s.key] ? sum + s.weight : sum),
        0
      ),
    [sectionStatus]
  );

  const canOpenSection = (index: number) =>
    index === 0 || sectionStatus[SECTIONS[index - 1].key];

  const saveSection = async (sectionKey: string) => {
    setLoading(true);
    try {
      const section = SECTIONS.find((s) => s.key === sectionKey);
      if (!section) return;

      const sectionBody = section.fields.reduce<Record<string, any>>(
        (acc, field) => {
          acc[field] = form[field];
          return acc;
        },
        {}
      );

      switch (section.key) {
        case "A":
          await setStoreInfo(sectionBody);
          break;
        case "B":
          await setAccountInfo(sectionBody);
          break;
        case "C":
          await setOperations(sectionBody);
          break;
      }

      Alert.alert("Saved", `${section.title} saved successfully`);
      setActiveSection(null);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save section");
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (progress !== 100) {
      return Alert.alert("Incomplete", "Please complete all sections");
    }

    setLoading(true);
    try {
      const res = await fetch(`${BaseURL}/store/create_store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Submission failed");

      const msg =
        Array.isArray(data?.message) ? data.message.join(", ") : String(data?.message);
      setMessage(msg);
      setShowNotification(true);

      Alert.alert("Success", "Store created successfully!");
    } catch (err: any) {
      setShowNotification(true);
      const msg =
        Array.isArray(err?.message) ? err.message.join(", ") : String(err?.message);
      setMessage(msg);

      Alert.alert("Error", err.message || "Failed to submit store");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RENDER
  ====================================================== */
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create Store</Text>
      <ProgressBar value={progress} />
      {message !== "" && showNotification && (
        <NotificationBar
          trigger={showNotification}
          text={message}
          onHide={() => setShowNotification(false)}
        />
      )}

      {activeSection === null && (
        <View>
          {SECTIONS.map((s, i) => {
            const locked = !canOpenSection(i);
            return (
              <TouchableOpacity
                key={s.key}
                disabled={locked}
                onPress={() => setActiveSection(s.key)}
                style={[styles.sectionCard, locked && styles.locked]}
              >
                <View>
                  <Text style={styles.sectionTitle}>{s.title}</Text>
                  <Text style={styles.sectionMeta}>
                    {s.weight}% • {sectionStatus[s.key] ? "Completed" : "Pending"}
                  </Text>
                </View>
                {sectionStatus[s.key] ? (
                  <Ionicons name="checkmark" color={"green"} />
                ) : locked ? (
                  <Ionicons name="lock-closed-outline" />
                ) : (
                  <Ionicons name="arrow-forward" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {activeSection && (
        <View style={styles.sectionForm}>
          <Text style={styles.formTitle}>
            {SECTIONS.find((s) => s.key === activeSection)?.title}
          </Text>
          {renderSectionFields(activeSection, form, update, addAddress, removeAddress, updateAddress)}
          {progress !== 100 && (
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => saveSection(activeSection)}
            >
              <Text style={styles.saveBtnText}>
                {loading ? "Saving..." : "Save & Continue"}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setActiveSection(null)}
            style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 }}
          >
            <Ionicons name={"arrow-back"} style={styles.backText} size={20} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {progress === 100 && (
        <TouchableOpacity style={styles.submit} onPress={submit}>
          <Text style={styles.submitText}>{loading ? "Submitting..." : "Create Store"}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

/* =====================================================
   FIELD RENDERER + MODAL PICKER
===================================================== */
function renderSectionFields(
  key: string,
  form: any,
  update: any,
  addAddress: () => void,
  removeAddress: (index: number) => void,
  updateAddress: (index: number, value: string) => void
) {
  const vendorTypes = ["restaurant", "supermarket", "pharmacy", "supplier", "groceries"];
  const deliveryTypes = ["instant", "preorder", "instant & preorder"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const times = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

  return (
    <>
      {key === "A" && (
        <>
          <Input label="Store Name" v={form.name} c={(v: any) => update({ name: v })} />
          <Input label="Description" v={form.description} c={(v: any) => update({ description: v })} />
          <Input label="Official Email" v={form.officialEmail} c={(v: any) => update({ officialEmail: v })} />
          <Input label="Official Phone" v={form.officialPhone} c={(v: any) => update({ officialPhone: v })} />

          <Text style={styles.label}>Store Addresses</Text>
          {form.addresses.map((addr: string, index: number) => (
            <View key={index} style={{ marginBottom: 12 }}>
              <Input
                label={`Address ${index + 1}`}
                v={addr}
                c={(v: string) => updateAddress(index, v)}
              />
              {form.addresses.length > 1 && (
                <TouchableOpacity onPress={() => removeAddress(index)}>
                  <Text style={{ color: "red", marginTop: 4 }}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={addAddress} style={{ marginBottom: 12 }}>
            <Text style={{ color: "#093131", fontWeight: "700" }}>+ Add another address</Text>
          </TouchableOpacity>

          <ModalPicker
            label="Vendor Type"
            options={vendorTypes}
            selected={form.vendorType}
            onSelect={(v: any) => update({ vendorType: v })}
          />
          <ModalPicker
            label="Delivery Type"
            options={deliveryTypes}
            selected={form.deliveryType}
            onSelect={(v: any) => update({ deliveryType: v })}
          />
        </>
      )}

      {key === "B" && (
        <>
          <Input label="Bank Name" v={form.bankName} c={(v: any) => update({ bankName: v })} />
          <Input label="Account Number" v={form.accountNumber} c={(v: any) => update({ accountNumber: v })} />
          <Input label="Account Name" v={form.accountName} c={(v: any) => update({ accountName: v })} />
        </>
      )}

      {key === "C" && (
        <>
          <Text style={styles.label}>Opening Days</Text>
          <View style={styles.multiSelectContainer}>
            {days.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.dayBtn, form.openingDays.includes(d) && styles.dayBtnSelected]}
                onPress={() =>
                  update({
                    openingDays: form.openingDays.includes(d)
                      ? form.openingDays.filter((x: string) => x !== d)
                      : [...form.openingDays, d],
                  })
                }
              >
                <Text style={form.openingDays.includes(d) ? styles.dayTextSelected : styles.dayText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <ModalPicker
            label="Opening Time"
            options={times}
            selected={form.openingTime}
            onSelect={(v: any) => update({ openingTime: v })}
          />
          <ModalPicker
            label="Closing Time"
            options={times}
            selected={form.closingTime}
            onSelect={(v: any) => update({ closingTime: v })}
          />
        </>
      )}
    </>
  );
}

/* =====================================================
   MODAL PICKER COMPONENT
===================================================== */
const ModalPicker = ({ label, options, selected, onSelect }: any) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setVisible(true)}
      >
        <Text>{selected || `Select ${label}`}</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */
const ProgressBar = ({ value }: { value: number }) => (
  <View style={{ marginBottom: 20 }}>
    <Text style={{ fontWeight: "700" }}>{value}% completed</Text>
    <View style={styles.bar}>
      <View style={[styles.fill, { width: `${value}%` }]} />
    </View>
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
  header: { fontSize: 22, fontWeight: "800", marginBottom: 10 },
  bar: { height: 8, backgroundColor: "#eee", borderRadius: 8 },
  fill: { height: "100%", backgroundColor: "#000", borderRadius: 8 },
  sectionCard: { padding: 16, backgroundColor: "#fff", borderRadius: 12, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", elevation: 2 },
  locked: { opacity: 0.4 },
  sectionTitle: { fontWeight: "700" },
  sectionMeta: { fontSize: 12, color: "#666" },
  sectionForm: { backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: "#ddd" },
  formTitle: { fontWeight: "800", fontSize: 16, marginBottom: 12 },
  label: { fontSize: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12 },
  multiSelectContainer: { flexDirection: "row", flexWrap: "wrap" },
  dayBtn: { padding: 8, margin: 4, borderWidth: 1, borderColor: "#ddd", borderRadius: 8 },
  dayBtnSelected: { backgroundColor: "#FF6B35", borderColor: "#FF6B35" },
  dayText: { color: "#000" },
  dayTextSelected: { color: "#fff" },
  saveBtn: { backgroundColor: "#093131", padding: 12, borderRadius: 8, marginTop: 8 },
  saveBtnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  backText: { color: "black", marginTop: 10, fontSize: 18 },
  submit: { backgroundColor: "#000", padding: 16, borderRadius: 12, marginBottom: 40 },
  submitText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  modalButton: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 15, borderTopRightRadius: 15, maxHeight: 300, paddingVertical: 10 },
  modalItem: { paddingVertical: 15, paddingHorizontal: 20 },
  modalItemText: { fontSize: 16 },
});
