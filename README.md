# Correctional Command System

## Project Description

For this project, I built a multi device correctional command system that allows different devices to communicate with each other in real time. The system is designed to simulate how officers and supervisors could communicate inside a correctional facility.

The mobile app is used by an officer to perform actions like changing zones, requesting backup, completing unit checks, and starting or ending a lockdown. The tablet acts as a live dashboard that displays the current facility status and recent events. The web admin dashboard allows supervisors to monitor everything happening in the facility and control the system when needed.

I chose this idea because I recently worked in corrections, so it was something I could relate to and build around.

---

## Architecture Overview

The project has four main parts:

- Mobile Controller (React Native)
- Tablet Monitor (React Native)
- Web Admin Dashboard (React + Vite)
- TypeScript Socket.IO Server

The server is the center of the entire system. Whenever an action happens on the mobile app or the web dashboard, it gets sent to the server. The server updates the facility state and immediately sends those updates to every connected device so everything stays synchronized.

---

## Key Real Time Features

- Zone selection updates every connected device instantly.
- Backup requests appear on the tablet and web dashboard in real time.
- Lockdown mode updates across all connected devices.
- Supervisors can change the facility mode from the web dashboard.
- Broadcast messages are sent from the web dashboard to the tablet monitor.
- Event logs update automatically as actions happen.
- The system keeps every interface synchronized through Socket.IO.

---

## Technical Implementation

This project was built using:

- TypeScript
- React Native
- Expo
- React
- Vite
- Express
- Socket.IO
- CSS

The server manages the entire facility state while Socket.IO handles the real time communication between every interface. The mobile controller sends officer actions, the tablet monitor displays the current system status, and the web admin dashboard provides management controls for supervisors.

---

## Project Structure

```text
correctional-command-system/
├── mobile-controller/
├── tablet-monitor/
├── web-admin/
├── server/
├── shared-types/
└── README.md
```

---

## Setup Instructions

### Prerequisites

Before running the project, install:

- Node.js
- npm
- Expo CLI
- iOS Simulator (or a physical device)
- A modern web browser

### Start the Server

```bash
cd server
npm install
npm run dev
```

### Start the Mobile Controller

```bash
cd mobile-controller
npm install
npx expo start
```

Press **i** to launch the iPhone simulator.

### Start the Tablet Monitor

```bash
cd tablet-monitor
npm install
npx expo start
```

Press **Shift + i** and choose the iPad simulator.

### Start the Web Dashboard

```bash
cd web-admin
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

---

## Network Configuration

If you're using a different Wi-Fi network, update the IP address inside these files:

- `mobile-controller/src/socket.ts`
- `tablet-monitor/src/socket.ts`
- `web-admin/src/socket.ts`

Each one should point to the computer running the Socket.IO server.

Example:

```text
http://192.168.1.204:3001
```

---

## Testing

To test the project:

1. Start the server.
2. Launch the mobile controller.
3. Launch the tablet monitor.
4. Launch the web admin dashboard.
5. Make sure all three connect to the server.
6. Change zones from the mobile app.
7. Request and clear backup.
8. Start and end lockdown.
9. Send a broadcast message from the web dashboard.
10. Verify every connected device updates immediately.

---

## Final Thoughts

This project gave me a better understanding of how multiple applications can communicate in real time through one server. I enjoyed building something based on a correctional environment because it's something I have experience with, and it made the project feel more realistic. Seeing changes happen instantly across all three interfaces was probably my favorite part of the project.
