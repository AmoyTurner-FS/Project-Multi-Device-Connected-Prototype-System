import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";

type FacilityState = {
  mode: string;
  activeZone: string;
  incidentLevel: string;
  backupRequested: boolean;
  lockdownActive: boolean;
  broadcastMessage: string;
  eventLog: string[];
};

function sendAdminCommand(type: string, value?: string) {
  socket.emit("admin-command", {
    type,
    value,
  });
}

function App() {
  const [connected, setConnected] = useState(false);
  const [broadcastText, setBroadcastText] = useState("");

  const [facility, setFacility] = useState<FacilityState>({
    mode: "normal",
    activeZone: "intake",
    incidentLevel: "normal",
    backupRequested: false,
    lockdownActive: false,
    broadcastMessage: "",
    eventLog: [],
  });

  useEffect(() => {
    if (socket.connected) {
      setConnected(true);
      socket.emit("register-client", "web");
    }

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("register-client", "web");
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("facility-update", (data: FacilityState) => {
      setFacility(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("facility-update");
    };
  }, []);
  return (
    <div className="container">
      <h1>Correctional Facility Admin Dashboard</h1>

      <div className="card">
        <h2>Connection Status</h2>
        <p>{connected ? "ONLINE" : "OFFLINE"}</p>
      </div>

      <div className="card">
        <h2>Facility Status</h2>
        <p>{facility.mode.toUpperCase()}</p>
      </div>

      <div className="card">
        <h2>Active Zone</h2>
        <p>{facility.activeZone.toUpperCase()}</p>
      </div>

      <div className="card">
        <h2>Backup Status</h2>
        <p>
          {facility.backupRequested
            ? "BACKUP REQUESTED"
            : "NO BACKUP REQUESTED"}
        </p>
      </div>

      <div className="card">
        <h2>Lockdown Status</h2>
        <p>
          {facility.lockdownActive ? "LOCKDOWN ACTIVE" : "NORMAL OPERATIONS"}
        </p>
        <div className="card">
          <h2>Admin Controls</h2>

          <button onClick={() => sendAdminCommand("set-mode", "normal")}>
            Set Normal Mode
          </button>

          <button onClick={() => sendAdminCommand("set-mode", "restricted")}>
            Set Restricted Mode
          </button>

          <button onClick={() => sendAdminCommand("set-mode", "lockdown")}>
            Start Lockdown
          </button>

          <button onClick={() => sendAdminCommand("clear-incident")}>
            Clear Incident
          </button>

          <button onClick={() => sendAdminCommand("reset-system")}>
            Reset System
          </button>
        </div>
        <div className="card">
          <h2>Broadcast Message</h2>

          <input
            value={broadcastText}
            onChange={(event) => setBroadcastText(event.target.value)}
            placeholder="Enter message for all devices"
          />

          <button
            onClick={() => {
              sendAdminCommand("broadcast", broadcastText);
              setBroadcastText("");
            }}
          >
            Send Broadcast
          </button>
        </div>
        <div className="card">
          <h2>Event Log</h2>

          {facility.eventLog.length === 0 ? (
            <p>No recent events</p>
          ) : (
            <ul>
              {facility.eventLog.map((event, index) => (
                <li key={index}>{event}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
