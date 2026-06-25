import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

type ClientType = "mobile" | "tablet" | "web" | "test";
type FacilityMode = "normal" | "restricted" | "lockdown";
type IncidentLevel = "normal" | "caution" | "emergency";
type FacilityZone = "intake" | "dorm-a" | "dorm-b" | "medical" | "yard";

interface ZoneStatus {
  zone: FacilityZone;
  label: string;
  status: IncidentLevel;
  lastCheck: number;
}

interface FacilityState {
  mode: FacilityMode;
  activeZone: FacilityZone;
  incidentLevel: IncidentLevel;
  backupRequested: boolean;
  lockdownActive: boolean;
  broadcastMessage: string;
  zones: ZoneStatus[];
  eventLog: string[];
  timestamp: number;
}

interface OfficerAction {
  type:
    | "set-zone"
    | "set-incident"
    | "request-backup"
    | "clear-backup"
    | "start-lockdown"
    | "end-lockdown"
    | "unit-check";
  value?: string | boolean;
}

interface AdminCommand {
  type:
    | "set-mode"
    | "clear-incident"
    | "broadcast"
    | "clear-events"
    | "reset-system";
  value?: string;
}

interface ConnectedClients {
  mobile: number;
  tablet: number;
  web: number;
  test: number;
}
const app = express();
const httpServer = createServer(app);

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let facilityState: FacilityState = {
  mode: "normal",
  activeZone: "intake",
  incidentLevel: "normal",
  backupRequested: false,
  lockdownActive: false,
  broadcastMessage: "System online",
  zones: [
    {
      zone: "intake",
      label: "Intake",
      status: "normal",
      lastCheck: Date.now(),
    },
    {
      zone: "dorm-a",
      label: "Dorm A",
      status: "normal",
      lastCheck: Date.now(),
    },
    {
      zone: "dorm-b",
      label: "Dorm B",
      status: "normal",
      lastCheck: Date.now(),
    },
    {
      zone: "medical",
      label: "Medical",
      status: "normal",
      lastCheck: Date.now(),
    },
    { zone: "yard", label: "Yard", status: "normal", lastCheck: Date.now() },
  ],
  eventLog: ["System started"],
  timestamp: Date.now(),
};

const connectedClients: ConnectedClients = {
  mobile: 0,
  tablet: 0,
  web: 0,
  test: 0,
};

declare module "socket.io" {
  interface Socket {
    clientType?: ClientType;
  }
}

function addEvent(message: string) {
  facilityState.eventLog = [
    `${new Date().toLocaleTimeString()} - ${message}`,
    ...facilityState.eventLog,
  ].slice(0, 10);

  facilityState.timestamp = Date.now();
}

function broadcastState() {
  io.emit("facility-update", facilityState);
  io.emit("client-counts", connectedClients);
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.emit("facility-update", facilityState);
  socket.emit("client-counts", connectedClients);

  socket.on("register-client", (clientType: ClientType) => {
    socket.clientType = clientType;
    connectedClients[clientType]++;

    addEvent(`${clientType} client connected`);
    broadcastState();

    console.log(
      `${clientType} client connected. Total: ${connectedClients[clientType]}`
    );
  });

  socket.on("officer-action", (action: OfficerAction) => {
    console.log("Officer Action Received:", action);
    switch (action.type) {
      case "set-zone":
        facilityState.activeZone = action.value as FacilityState["activeZone"];
        addEvent(`Officer selected zone: ${facilityState.activeZone}`);
        break;

      case "set-incident":
        facilityState.incidentLevel =
          action.value as FacilityState["incidentLevel"];
        facilityState.zones = facilityState.zones.map((zone) =>
          zone.zone === facilityState.activeZone
            ? { ...zone, status: facilityState.incidentLevel }
            : zone
        );
        addEvent(`Incident level changed to ${facilityState.incidentLevel}`);
        break;

      case "request-backup":
        facilityState.backupRequested = true;
        addEvent(`Backup requested in ${facilityState.activeZone}`);
        break;

      case "clear-backup":
        facilityState.backupRequested = false;
        addEvent("Backup request cleared");
        break;

      case "start-lockdown":
        facilityState.mode = "lockdown";
        facilityState.lockdownActive = true;
        facilityState.incidentLevel = "emergency";
        addEvent("LOCKDOWN ACTIVATED");
        break;

      case "end-lockdown":
        facilityState.mode = "normal";
        facilityState.lockdownActive = false;
        facilityState.incidentLevel = "normal";
        addEvent("Lockdown ended");
        break;

      case "unit-check":
        facilityState.zones = facilityState.zones.map((zone) =>
          zone.zone === facilityState.activeZone
            ? { ...zone, lastCheck: Date.now() }
            : zone
        );
        addEvent(`Unit check completed for ${facilityState.activeZone}`);
        break;
    }

    broadcastState();
  });

  socket.on("admin-command", (command: AdminCommand) => {
    switch (command.type) {
      case "set-mode":
        facilityState.mode = command.value as FacilityState["mode"];
        facilityState.lockdownActive = facilityState.mode === "lockdown";
        addEvent(`Admin changed facility mode to ${facilityState.mode}`);
        break;

      case "clear-incident":
        facilityState.incidentLevel = "normal";
        facilityState.backupRequested = false;
        facilityState.lockdownActive = false;
        facilityState.mode = "normal";
        facilityState.zones = facilityState.zones.map((zone) => ({
          ...zone,
          status: "normal",
        }));
        addEvent("Admin cleared all incidents");
        break;

      case "broadcast":
        facilityState.broadcastMessage = command.value || "";
        addEvent(`Admin broadcast: ${facilityState.broadcastMessage}`);
        break;

      case "clear-events":
        facilityState.eventLog = [];
        addEvent("Event log cleared");
        break;

      case "reset-system":
        facilityState.mode = "normal";
        facilityState.incidentLevel = "normal";
        facilityState.backupRequested = false;
        facilityState.lockdownActive = false;
        facilityState.broadcastMessage = "System reset";
        facilityState.zones = facilityState.zones.map((zone) => ({
          ...zone,
          status: "normal",
        }));
        addEvent("System reset by admin");
        break;
    }

    broadcastState();
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    if (socket.clientType) {
      connectedClients[socket.clientType] = Math.max(
        0,
        connectedClients[socket.clientType] - 1
      );

      addEvent(`${socket.clientType} client disconnected`);
      broadcastState();
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Correctional Command Server running on port ${PORT}`);
  console.log("Waiting for clients to connect...");
});
