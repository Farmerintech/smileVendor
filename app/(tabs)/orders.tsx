import { useStatusBar } from "@/hooks/statusBar";
import { Picker } from "@react-native-picker/picker";
import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

/* =====================================================
   SECTION CONFIG (SOURCE OF TRUTH)
===================================================== */
const SECTIONS = [
  { key: "A", title: "Store Information", weight: 35, fields: ["name","description","officialEmail","officialPhone","vendorType","deliveryType"] },
  { key: "B", title: "Account Details", weight: 20, fields: ["bankName","accountNumber","accountName"] },
  { key: "C", title: "Store Operations", weight: 25, fields: ["openingDays","openingTime","closingTime"] },
  { key: "D", title: "Store Address", weight: 20, fields: ["street","city","state","lat","long"] },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */
export default function CreateStoreWizard() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    storeId: "",
    name: "", description: "", officialEmail: "", officialPhone: "",
    vendorType: "restaurant", deliveryType: "instant",
    bankName: "", accountNumber: "", accountName: "",
    openingDays: [] as string[], openingTime: "", closingTime: "",
    street: "", city: "", state: "", lat: "", long: "",
  });
  const [loading, setLoading] = useState(false);

  useStatusBar("white", "dark-content");  

  const update = (data: any) => setForm((p:any) => ({ ...p, ...data }));

  /* =====================================================
     SECTION COMPLETION
  ===================================================== */
  const sectionStatus = useMemo(() => {
    const result: Record<string, boolean> = {};
    SECTIONS.forEach((s) => {
      result[s.key] = s.fields.every(f => {
        const v = form[f];
        if (Array.isArray(v)) return v.length > 0;
        return v !== "" && v !== null && v !== undefined;
      });
    });
    return result;
  }, [form]);

  const progress = useMemo(() => SECTIONS.reduce((sum, s) => (sectionStatus[s.key] ? sum + s.weight : sum), 0), [sectionStatus]);
  const canOpenSection = (index:number) => index === 0 || sectionStatus[SECTIONS[index-1].key];

  /* =====================================================
     SAVE SECTION
  ===================================================== */
  const saveSection = async (sectionKey:string) => {
    setLoading(true);
    try {
      let method = form.storeId ? "PUT" : "POST";
      let url = form.storeId ? `/vendor/store/${form.storeId}` : "/vendor/store";
      let body:any = { ...form };

      // Only send fields relevant to this section
      const section = SECTIONS.find(s => s.key === sectionKey);
      if(section) {
        body = section.fields.reduce((acc:any, f) => ({ ...acc, [f]: form[f] }), {});
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Error saving section");

      // If first section, get storeId
      if(sectionKey === "A" && data?.id) update({ storeId: data.id });

      Alert.alert("Saved", `${section?.title} saved successfully!`);
      setActiveSection(null);
    } catch(err:any) {
      Alert.alert("Error", err.message || "Failed to save section");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FINAL SUBMIT
  ===================================================== */
  const submit = async () => {
    if(progress !== 100) return Alert.alert("Incomplete", "Please complete all sections");

    setLoading(true);
    try {
      const res = await fetch(`/vendor/store/${form.storeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Submission failed");

      Alert.alert("Success", "Store created successfully!");
    } catch(err:any) {
      Alert.alert("Error", err.message || "Failed to submit store");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create Store</Text>
      <ProgressBar value={progress} />

      {/* SECTION LIST */}
      {activeSection === null && (
        <View>
          {SECTIONS.map((s,i) => {
            const locked = !canOpenSection(i);
            return (
              <TouchableOpacity key={s.key} disabled={locked} onPress={()=>setActiveSection(s.key)} style={[styles.sectionCard, locked && styles.locked]}>
                <View>
                  <Text style={styles.sectionTitle}>{s.title}</Text>
                  <Text style={styles.sectionMeta}>{s.weight}% • {sectionStatus[s.key] ? "Completed" : "Pending"}</Text>
                </View>
                <Text style={styles.statusIcon}>{sectionStatus[s.key] ? "✅" : locked ? "🔒" : "➡️"}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ACTIVE SECTION FORM */}
      {activeSection && (
        <View style={styles.sectionForm}>
          <Text style={styles.formTitle}>{SECTIONS.find(s=>s.key===activeSection)?.title}</Text>
          {renderSectionFields(activeSection, form, update)}
          <TouchableOpacity style={styles.saveBtn} onPress={()=>saveSection(activeSection)}>
            <Text style={styles.saveBtnText}>{loading ? "Saving..." : "Save & Continue"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.back} onPress={()=>setActiveSection(null)}>
            <Text style={styles.backText}>← Back to sections</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FINAL SUBMIT */}
      {progress===100 && (
        <TouchableOpacity style={styles.submit} onPress={submit}>
          <Text style={styles.submitText}>{loading ? "Submitting..." : "Create Store"}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

/* =====================================================
   SECTION FIELD RENDERER
===================================================== */
function renderSectionFields(key:string, form:any, update:(data:any)=>void){
  const vendorTypes = ["restaurant","supermarket","pharmacy","supplier","groceries"];
  const deliveryTypes = ["instant","preorder","instant & preorder"];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const times = Array.from({length:24},(_,i)=>`${i.toString().padStart(2,'0')}:00`);

  switch(key){
    case "A":
      return <>
        <Input label="Store Name" v={form.name} c={v=>update({name:v})} />
        <Input label="Description" v={form.description} c={v=>update({description:v})} />
        <Input label="Official Email" v={form.officialEmail} c={v=>update({officialEmail:v})} />
        <Input label="Official Phone" v={form.officialPhone} c={v=>update({officialPhone:v})} />
        <Text style={styles.label}>Vendor Type</Text>
        <Picker selectedValue={form.vendorType} onValueChange={v=>update({vendorType:v})} style={styles.picker}>{vendorTypes.map(v=><Picker.Item key={v} label={v} value={v}/>)}</Picker>
        <Text style={styles.label}>Delivery Type</Text>
        <Picker selectedValue={form.deliveryType} onValueChange={v=>update({deliveryType:v})} style={styles.picker}>{deliveryTypes.map(v=><Picker.Item key={v} label={v} value={v}/>)}</Picker>
      </>;

    case "B":
      return <>
        <Input label="Bank Name" v={form.bankName} c={v=>update({bankName:v})} />
        <Input label="Account Number" v={form.accountNumber} c={v=>update({accountNumber:v})} />
        <Input label="Account Name" v={form.accountName} c={v=>update({accountName:v})} />
      </>;

    case "C":
      return <>
        <Text style={styles.label}>Opening Days (Select multiple)</Text>
        <View style={styles.multiSelectContainer}>
          {days.map(day=>(
            <TouchableOpacity
              key={day}
              style={[
                styles.dayBtn,
                form.openingDays.includes(day) && styles.dayBtnSelected
              ]}
              onPress={()=>{
                const newDays = form.openingDays.includes(day)
                  ? form.openingDays.filter(d=>d!==day)
                  : [...form.openingDays, day];
                update({openingDays:newDays});
              }}
            >
              <Text style={form.openingDays.includes(day) ? styles.dayTextSelected : styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Opening Time</Text>
        <Picker selectedValue={form.openingTime} onValueChange={v=>update({openingTime:v})} style={styles.picker}>{times.map(t=><Picker.Item key={t} label={t} value={t}/>)}</Picker>
        <Text style={styles.label}>Closing Time</Text>
        <Picker selectedValue={form.closingTime} onValueChange={v=>update({closingTime:v})} style={styles.picker}>{times.map(t=><Picker.Item key={t} label={t} value={t}/>)}</Picker>
      </>;

    case "D":
      return <>
        <Input label="Street" v={form.street} c={v=>update({street:v})} />
        <Input label="City" v={form.city} c={v=>update({city:v})} />
        <Input label="State" v={form.state} c={v=>update({state:v})} />
        <Input label="Latitude" v={form.lat} c={v=>update({lat:v})} />
        <Input label="Longitude" v={form.long} c={v=>update({long:v})} />
      </>;
  }
}

/* =====================================================
   REUSABLE UI
===================================================== */
const ProgressBar = ({ value }: { value:number }) => (
  <View style={{marginBottom:20}}>
    <Text style={{fontWeight:"700"}}>{value}% completed</Text>
    <View style={styles.bar}><View style={[styles.fill,{width:`${value}%`}]} /></View>
  </View>
);

const Input:any = ({ label,v,c }:any)=>(<View style={{marginBottom:12}}>
  <Text style={styles.label}>{label}</Text>
  <TextInput value={v} onChangeText={c} style={styles.input}/>
</View>);

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  container:{padding:16},
  header:{fontSize:22,fontWeight:"800",marginBottom:10},
  bar:{height:8,backgroundColor:"#eee",borderRadius:8},
  fill:{height:"100%",backgroundColor:"#000",borderRadius:8},
  sectionCard:{padding:16,backgroundColor:"#fff",borderRadius:12,marginBottom:12,flexDirection:"row",justifyContent:"space-between",alignItems:"center",elevation:2},
  locked:{opacity:0.4},
  sectionTitle:{fontWeight:"700"},
  sectionMeta:{fontSize:12,color:"#666",marginTop:4},
  statusIcon:{fontSize:18},
  sectionForm:{backgroundColor:"#fff",padding:16,borderRadius:12,marginBottom:20},
  formTitle:{fontWeight:"800",fontSize:16,marginBottom:12},
  label:{fontSize:12,marginBottom:4},
  input:{borderWidth:1,borderColor:"#ddd",borderRadius:8,padding:12},
  picker:{borderWidth:1,borderColor:"#ddd",borderRadius:8,marginBottom:12,backgroundColor:"#fff"},
  multiSelectContainer:{flexDirection:"row",flexWrap:"wrap",marginBottom:12},
  dayBtn:{padding:8,margin:4,borderWidth:1,borderColor:"#ddd",borderRadius:8},
  dayBtnSelected:{backgroundColor:"#007AFF",borderColor:"#007AFF"},
  dayText:{color:"#000"},
  dayTextSelected:{color:"#fff"},
  saveBtn:{backgroundColor:"#007AFF",padding:12,borderRadius:8,marginVertical:8},
  saveBtnText:{color:"#fff",textAlign:"center",fontWeight:"700"},
  back:{marginTop:10},
  backText:{color:"#007AFF",fontWeight:"600"},
  submit:{backgroundColor:"#000",padding:16,borderRadius:12,marginBottom:40},
  submitText:{color:"#fff",textAlign:"center",fontWeight:"700"},
});
