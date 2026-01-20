import { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* =====================================================
   SECTION CONFIG (SOURCE OF TRUTH)
===================================================== */
const SECTIONS = [
  {
    key: "A",
    title: "Store Information",
    weight: 35,
    fields: [
      "vendorId",
      "name",
      "description",
      "officialEmail",
      "officialPhone",
      "vendorType",
      "deliveryType",
    ],
  },
  {
    key: "B",
    title: "Account Details",
    weight: 20,
    fields: ["bankName", "accountNumber", "accountName"],
  },
  {
    key: "C",
    title: "Store Operations",
    weight: 25,
    fields: ["openingDays", "openingTime", "closingTime"],
  },
  {
    key: "D",
    title: "Store Address",
    weight: 20,
    fields: ["street", "city", "state", "lat", "long"],
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */
export default function CreateStoreWizard() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const [form, setForm] = useState({
    vendorId: "",
    name: "",
    description: "",
    officialEmail: "",
    officialPhone: "",
    vendorType: "restaurant",
    deliveryType: "instant",

    bankName: "",
    accountNumber: "",
    accountName: "",

    openingDays: [] as string[],
    openingTime: "",
    closingTime: "",
    isActive: true,

    street: "",
    city: "",
    state: "",
    lat: "",
    long: "",
  });

  const update = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  /* =====================================================
     SECTION COMPLETION
  ===================================================== */
  const sectionStatus = useMemo(() => {
    const result: Record<string, boolean> = {};

    SECTIONS.forEach((s) => {
      result[s.key] = s.fields.every((f) => {
        const v:any = (form as any)[f];
        if (Array.isArray(v)) return v.length > 0;
        return v !== "" && v !== null && v !== undefined;
      });
    });

    return result;
  }, [form]);

  /* =====================================================
     PROGRESS
  ===================================================== */
  const progress = useMemo(() => {
    return SECTIONS.reduce(
      (sum, s) => (sectionStatus[s.key] ? sum + s.weight : sum),
      0
    );
  }, [sectionStatus]);

  /* =====================================================
     NAVIGATION RULES
  ===================================================== */
  const canOpenSection = (index: number) => {
    if (index === 0) return true;
    return sectionStatus[SECTIONS[index - 1].key];
  };

  /* =====================================================
     SUBMIT
  ===================================================== */
  const submit = () => {
    if (progress !== 100) {
      Alert.alert("Incomplete", "Please complete all sections");
      return;
    }

    console.log("FINAL PAYLOAD", form);
    Alert.alert("Success", "Store created successfully");
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create Store</Text>
      <ProgressBar value={progress} />

      {/* =====================
          SECTION SUMMARY LIST
      ===================== */}
      {activeSection === null && (
        <View>
          {SECTIONS.map((s, i) => {
            const locked = !canOpenSection(i);
            return (
              <TouchableOpacity
                key={s.key}
                disabled={locked}
                onPress={() => setActiveSection(s.key)}
                style={[
                  styles.sectionCard,
                  locked && styles.locked,
                ]}
              >
                <View>
                  <Text style={styles.sectionTitle}>{s.title}</Text>
                  <Text style={styles.sectionMeta}>
                    {s.weight}% • {sectionStatus[s.key] ? "Completed" : "Pending"}
                  </Text>
                </View>
                <Text style={styles.statusIcon}>
                  {sectionStatus[s.key] ? "✅" : locked ? "🔒" : "➡️"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* =====================
          ACTIVE SECTION FORM
      ===================== */}
      {activeSection && (
        <View style={styles.sectionForm}>
          <Text style={styles.formTitle}>
            {SECTIONS.find((s) => s.key === activeSection)?.title}
          </Text>

          {renderSectionFields(activeSection, form, update)}

          <TouchableOpacity
            style={styles.back}
            onPress={() => setActiveSection(null)}
          >
            <Text style={styles.backText}>← Back to sections</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* =====================
          FINAL SUBMIT
      ===================== */}
      {progress === 100 && (
        <TouchableOpacity style={styles.submit} onPress={submit}>
          <Text style={styles.submitText}>Create Store</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

/* =====================================================
   SECTION FIELD RENDERER
===================================================== */
function renderSectionFields(
  key: string,
  form: any,
  update: (k: string, v: any) => void
) {
  switch (key) {
    case "A":
      return (
        <>
          {/* <Input label="Vendor ID" v={form.vendorId} c={(v:) => update("vendorId", v)} /> */}
          <Input label="Store Name" v={form.name} c={(v:string) => update("name", v)} />
          <Input label="Description" v={form.description} c={(v:string) => update("description", v)} />
          <Input label="Official Email" v={form.officialEmail} c={(v:string) => update("officialEmail", v)} />
          <Input label="Official Phone" v={form.officialPhone} c={(v:string) => update("officialPhone", v)} />
          <Input label="Vendor Type" v={form.vendorType} c={(v:string) => update("vendorType", v)} />
          <Input label="Delivery Type" v={form.deliveryType} c={(v:string) => update("deliveryType", v)} />
        </>
      );
    case "B":
      return (
        <>
          <Input label="Bank Name" v={form.bankName} c={(v:string) => update("bankName", v)} />
          <Input label="Account Number" v={form.accountNumber} c={(v:string) => update("accountNumber", v)} />
          <Input label="Account Name" v={form.accountName} c={(v:string) => update("accountName", v)} />
        </>
      );
    case "C":
      return (
        <>
          <Input
            label="Opening Days (Mon,Tue)"
            v={form.openingDays.join(",")}
            c={(v:string) => update("openingDays", v.split(","))}
          />
          <Input label="Opening Time" v={form.openingTime} c={(v:string) => update("openingTime", v)} />
          <Input label="Closing Time" v={form.closingTime} c={(v:string) => update("closingTime", v)} />
        </>
      );
    case "D":
      return (
        <>
          <Input label="Street" v={form.street} c={(v:string) => update("street", v)} />
          <Input label="City" v={form.city} c={(v:string) => update("city", v)} />
          <Input label="State" v={form.state} c={(v:string) => update("state", v)} />
          <Input label="Latitude" v={form.lat} c={(v:string) => update("lat", v)} />
          <Input label="Longitude" v={form.long} c={(v:string) => update("long", v)} />
        </>
      );
  }
}

/* =====================================================
   REUSABLE UI
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

  sectionCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  locked: { opacity: 0.4 },
  sectionTitle: { fontWeight: "700" },
  sectionMeta: { fontSize: 12, color: "#666", marginTop: 4 },
  statusIcon: { fontSize: 18 },

  sectionForm: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  formTitle: { fontWeight: "800", fontSize: 16, marginBottom: 12 },

  label: { fontSize: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },

  back: { marginTop: 20 },
  backText: { color: "#007AFF", fontWeight: "600" },

  submit: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  submitText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
