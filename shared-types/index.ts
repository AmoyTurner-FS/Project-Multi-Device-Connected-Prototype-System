export type ClientType = "mobile" | "tablet" | "web" | "test";

export type FacilityMode = "normal" | "restricted" | "lockdown";

export type IncidentLevel = "normal" | "caution" | "emergency";

export type FacilityZone = "intake" | "dorm-a" | "dorm-b" | "medical" | "yard";

export interface ZoneStatus {
  zone: FacilityZone;
  label: string;
  status: IncidentLevel;
  lastCheck: number;
}

export interface FacilityState {
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

export interface OfficerAction {
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

export interface AdminCommand {
  type:
    | "set-mode"
    | "clear-incident"
    | "broadcast"
    | "clear-events"
    | "reset-system";
  value?: string;
}

export interface ConnectedClients {
  mobile: number;
  tablet: number;
  web: number;
  test: number;
}
