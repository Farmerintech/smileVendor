import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";

interface progressBarProps {
  index: number;
  mylink: any;
  value: number
}
export const ProgressBar = ({ index, mylink, value }: progressBarProps) => {
  return (
    <View style={styles.mainContainer}>
      <View>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressDot,
              index === 1 ? styles.activeDot : styles.inactiveDot,
            ]}
          />
          <View
            style={[
              styles.progressDot,
              index === 2 ? styles.activeDot : styles.inactiveDot,
            ]}
          />
         
        </View>

        <Text style={styles.skipText}>Skip</Text>
      </View>
      <Link href={mylink}>
        <ProgressIndicator realvalue={value} />
      </Link>
    </View>
  );
};

const ProgressIndicator = ({ realvalue }: any) => {
  return (
    <View style={{ position: "relative" }}>
      <CircularProgress
        radius={50}
        value={realvalue}
        inActiveStrokeColor={"gray"}
        activeStrokeColor={"#1EBA8D"}
        inActiveStrokeOpacity={0.2}
        inActiveStrokeWidth={6}
        duration={2000}
      />
      <View style={styles.container}>
        <MaterialCommunityIcons name="arrow-right" size={25} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 150,
    alignItems: "center",
  },
  skipText: {
    color: "#1EBA8D",
    marginTop: 5,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#1EBA8D/20",
  },
  activeDot: {
    backgroundColor: "#1EBA8D",
    width: 30, // Larger width for active dot
  },
  inactiveDot: {
    backgroundColor: "white",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1EBA8D",
    borderColor: "#1EBA8D",
    position: "absolute",
    left: 20,
    top: 20,
    right: 50,
  },
  subcontainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1EBA8D",
  },
  container2: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
