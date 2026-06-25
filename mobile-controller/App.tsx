import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { socket } from "./src/socket";

export default function App() {
  const [currentZone, setCurrentZone] = useState("INTAKE");
  const [facilityStatus, setFacilityStatus] = useState("NORMAL");

  useEffect(() => {
    socket.emit("register-client", "mobile");

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Officer Command Device</Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Facility Status</Text>
        <Text style={styles.statusValue}>{facilityStatus}</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Current Zone</Text>
        <Text style={styles.statusValue}>{currentZone}</Text>
      </View>

      <View style={styles.controlCard}>
        <Text style={styles.sectionTitle}>Select Zone</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setCurrentZone("INTAKE");

              socket.emit("officer-action", {
                type: "set-zone",
                value: "intake",
              });
            }}
          >
            <Text style={styles.buttonText}>Intake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setCurrentZone("DORM A");

              socket.emit("officer-action", {
                type: "set-zone",
                value: "dorm-a",
              });
            }}
          >
            <Text style={styles.buttonText}>Dorm A</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setCurrentZone("DORM B");

              socket.emit("officer-action", {
                type: "set-zone",
                value: "dorm-b",
              });
            }}
          >
            <Text style={styles.buttonText}>Dorm B</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setCurrentZone("MEDICAL");

              socket.emit("officer-action", {
                type: "set-zone",
                value: "medical",
              });
            }}
          >
            <Text style={styles.buttonText}>Medical</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.controlCard}>
        <Text style={styles.sectionTitle}>Officer Actions</Text>

        <TouchableOpacity
          style={styles.backupButton}
          onPress={() => {
            socket.emit("officer-action", {
              type: "request-backup",
            });
          }}
        >
          <Text style={styles.actionText}>🆘 Request Backup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => {
            setFacilityStatus("NORMAL");

            socket.emit("officer-action", {
              type: "unit-check",
            });
          }}
        >
          <Text style={styles.actionText}>✅ Unit Check</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.lockdownButton}
          onPress={() => {
            setFacilityStatus("LOCKDOWN");

            socket.emit("officer-action", {
              type: "start-lockdown",
            });
          }}
        >
          <Text style={styles.actionText}>🔒 Lockdown</Text>
        </TouchableOpacity>
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

  controlCard: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },

  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#374151",
    padding: 12,
    borderRadius: 8,
    width: "48%",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  backupButton: {
    backgroundColor: "#F59E0B",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },

  checkButton: {
    backgroundColor: "#10B981",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },

  lockdownButton: {
    backgroundColor: "#DC2626",
    padding: 15,
    borderRadius: 8,
  },

  actionText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
