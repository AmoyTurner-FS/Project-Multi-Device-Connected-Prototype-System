import { io } from "socket.io-client";

export const socket = io("http://192.168.1.204:3001", {
  transports: ["websocket", "polling"],
});
