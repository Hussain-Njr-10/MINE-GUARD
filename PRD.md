# Product Requirements Document (PRD)

## 1. Product Requirements
MINE GUARDS is a real-time mine subsidence monitoring and early warning system. It must provide mine operators with a clear, immediate understanding of the safety status of various underground mine zones.

## 2. Users
- **Mine Operators / Safety Officers:** Primary users of the Command Center dashboard.
- **SIH Evaluators:** The target audience for the prototype demonstration.

## 3. Core Features
- **Dashboard (Command Center):** Desktop-first overview of all mine zones, active sensor nodes, risk scores, and system health.
- **Sensor Node Interface:** A mobile-first UI (running on a smartphone) to simulate a physical sensor node in the field.
- **Risk Analysis Engine:** Processes incoming sensor data to calculate risk scores and determine zone safety states.
- **Early Warning System:** Generates visual and auditory alerts when parameters breach safety thresholds.

## 4. Sensor Parameters
The system monitors the following core parameters per node:
- Tilt / inclination
- Displacement
- Vibration
- Strain
- Temperature
- Battery / node health

## 5. Demo Requirements
The UI must make the following 14-step presentation sequence seamless and easy to perform:
1. Open Command Center.
2. Show mine zones and healthy sensor nodes.
3. Open the smartphone Sensor Node.
4. Show live sensor parameters.
5. Send a normal reading.
6. Dashboard receives/reflects the reading.
7. Trigger a Warning scenario.
8. Dashboard changes the relevant zone to WARNING.
9. Trigger a Critical scenario.
10. Dashboard changes the zone to CRITICAL.
11. Risk score changes.
12. Alert appears.
13. Operator can see which node/zone generated the alert.
14. Explain production system architecture (ESP32 + ML).

## 6. Functional & Non-Functional Requirements
- **Functional:** The frontend must support decoupling of the mock data layer so it can eventually be replaced by REST APIs, WebSockets, or MQTT brokers.
- **Non-Functional:** Fast load times, responsive layout (desktop-first for dashboard, mobile-first for sensor node), accessible color contrast, and highly professional aesthetic. No fabricated ML claims.
