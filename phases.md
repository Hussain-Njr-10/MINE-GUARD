# Phase Roadmap

We will build the application iteratively, one phase at a time. At the end of each phase, we will test, verify UX/responsiveness, summarize, and require explicit approval before moving to the next.

## Phase 1 — Foundation + Command Center
- Initialize project structure (Vite + React + Tailwind + TypeScript).
- Setup routing and global layout.
- Build the static desktop-first Command Center dashboard shell (Dark mode, industrial aesthetic).
- Create placeholder widgets for zones, charts, and alerts.

## Phase 2 — Sensor Node
- Build the mobile-first Sensor Node prototype interface.
- Implement UI for viewing simulated parameters.
- Add presenter controls to trigger different data states (Normal, Warning, Critical).

## Phase 3 — Live Demo Data / Communication
- Implement the internal mock data service/state management.
- Connect the Sensor Node UI to the Command Center UI (simulate data transmission).
- Ensure decoupling (data layer abstract enough to replace with real APIs later).

## Phase 4 — Risk Analysis + Alerts
- Implement the simulated risk engine logic (threshold evaluation).
- Build the visual state transitions for Mine Zones (Green → Yellow → Red).
- Build the Early Warning System (Alert popups, risk score changes, logs).

## Phase 5 — Advanced Visualization / Mine Map
- Integrate charting (e.g., Recharts) for tilt, displacement, vibration trends.
- Enhance the mine zone visualizer (logical mapping of sensor node locations).

## Phase 6 — Mobile Optimization
- Perform comprehensive responsive checks.
- Ensure the dashboard scales gracefully to smaller screens if needed.
- Ensure the Sensor Node remains perfectly optimized for mobile.

## Phase 7 — Demo Polish / Testing
- Run through the 14-step presentation sequence.
- Refine animations, typography, and visual hierarchy.
- Final bug fixes and technical quality pass.
