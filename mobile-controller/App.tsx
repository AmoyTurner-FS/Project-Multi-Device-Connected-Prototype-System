import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Officer Command Device</Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Facility Status</Text>
        <Text style={styles.statusValue}>NORMAL</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Current Zone</Text>
        <Text style={styles.statusValue}>INTAKE</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  statusCard: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },

  statusLabel: {
    color: "#9CA3AF",
    fontSize: 16,
  },

  statusValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
});
