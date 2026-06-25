import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { socket } from "./src/socket";

type FacilityState = {
  mode: string;
  activeZone: string;
  incidentLevel: string;
  backupRequested: boolean;
  lockdownActive: boolean;
  broadcastMessage: string;
  eventLog: string[];
};

export default function App() {
  const [connected, setConnected] = useState(false);

  const [facilityState, setFacilityState] = useState<FacilityState>({
    mode: "normal",
    activeZone: "intake",
    incidentLevel: "normal",
    backupRequested: false,
    lockdownActive: false,
    broadcastMessage: "System online",
    eventLog: [],
  });

  useEffect(() => {
    if (socket.connected) {
      setConnected(true);
      socket.emit("register-client", "tablet");
    }

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("register-client", "tablet");
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("facility-update", (state: FacilityState) => {
      console.log("Tablet received update:", state);
      setFacilityState(state);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("facility-update");
      socket.disconnect();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Facility Monitor Dashboard</Text>

      <View style={styles.statusRow}>
        <View style={styles.statusCard}>
          <Text style={styles.label}>Connection</Text>
          <Text style={[styles.value, connected ? styles.green : styles.red]}>
            {connected ? "ONLINE" : "OFFLINE"}
          </Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.label}>Mode</Text>
          <Text style={styles.value}>{facilityState.mode.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusCard}>
          <Text style={styles.label}>Active Zone</Text>
          <Text style={styles.value}>
            {facilityState.activeZone.toUpperCase()}
          </Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.label}>Incident Level</Text>
          <Text
            style={[
              styles.value,
              facilityState.incidentLevel === "emergency"
                ? styles.red
                : facilityState.incidentLevel === "caution"
                ? styles.yellow
                : styles.green,
            ]}
          >
            {facilityState.incidentLevel.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.alertCard}>
        <Text style={styles.label}>Backup Status</Text>
        <Text
          style={[
            styles.alertText,
            facilityState.backupRequested ? styles.yellow : styles.green,
          ]}
        >
          {facilityState.backupRequested
            ? "BACKUP REQUESTED"
            : "NO BACKUP REQUESTED"}
        </Text>
      </View>

      <View style={styles.alertCard}>
        <Text style={styles.label}>Lockdown Status</Text>
        <Text
          style={[
            styles.alertText,
            facilityState.lockdownActive ? styles.red : styles.green,
          ]}
        >
          {facilityState.lockdownActive
            ? "LOCKDOWN ACTIVE"
            : "NORMAL OPERATIONS"}
        </Text>
      </View>

      <View style={styles.messageCard}>
        <Text style={styles.label}>Broadcast Message</Text>
        <Text style={styles.message}>{facilityState.broadcastMessage}</Text>
      </View>

      <View style={styles.logCard}>
        <Text style={styles.sectionTitle}>Recent Events</Text>

        <ScrollView>
          {facilityState.eventLog.map((event, index) => (
            <Text key={index} style={styles.eventText}>
              {event}
            </Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
  statusCard: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 20,
  },
  label: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  alertCard: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  alertText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  messageCard: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  message: {
    color: "white",
    fontSize: 18,
  },
  logCard: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventText: {
    color: "#CBD5E1",
    fontSize: 14,
    marginBottom: 8,
  },
  green: {
    color: "#22C55E",
  },
  yellow: {
    color: "#FACC15",
  },
  red: {
    color: "#EF4444",
  },
});
