# Architecture

## 1. Current Frontend Demo Architecture
The prototype is built to simulate the complete data lifecycle entirely within the frontend (or with a lightweight mock backend) to facilitate the SIH presentation.
- **Stack:** React, TypeScript, Vite, Tailwind CSS.
- **State Management:** A centralized mock data service or context that handles simulated data streams and risk threshold logic.
- **Components:** Clean, reusable components built with separation of concerns.
- **Decoupling:** The UI is NOT tightly coupled to mock data. Data providers are abstracted so they can be easily swapped for real network calls later.

## 2. Future Production Architecture
The intended production architecture that the prototype represents:
1. **Sensor Node:** ESP32 microcontroller with physical sensors (Tilt, Displacement, Strain gauge, Vibration, Temperature, Battery, MicroSD, Buzzer/LED, Rugged enclosure). Optional future camera module.
2. **Gateway:** LoRa communication gateway.
3. **Backend/Database:** Secure cloud or on-premise server handling MQTT/WebSocket streams and time-series data storage.
4. **Risk Engine:** Validated Machine Learning model for subsidence prediction and anomaly detection.
5. **Dashboard:** The React frontend (what we are building now), consuming real APIs.

## 3. Data Flow

### Demo Data Flow:
`Smartphone Simulated Node (Mobile UI) / Mock Generator` → `Mock State Manager (Browser/Local)` → `Simulated Risk Engine` → `Command Center Dashboard`

### Production Data Flow:
`Physical ESP32 Node` → `LoRa Gateway` → `Backend API / MQTT Broker` → `ML Risk Engine & DB` → `Command Center Dashboard`

## 4. Architectural Principles
- **Modularity:** Build components that ingest standard data props regardless of the source.
- **Mocking:** Create a dedicated "Demo Controller" that makes it easy for the presenter to trigger specific states (Normal, Warning, Critical) predictably.
