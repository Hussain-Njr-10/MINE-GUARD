# Design Guidelines

## 1. UI/UX Direction
**Vibe:** Industrial command center + mining operations + modern SaaS + safety monitoring.
The application must look serious, credible, and highly professional. This is a safety-critical tool, not a generic student project or consumer app.

**Avoid:**
- Generic Bootstrap-looking dashboards
- Excessive gradients or cartoonish graphics
- Fake futuristic sci-fi UI (no unnecessary 3D effects)
- Clutter

## 2. Visual Language
- **Theme:** Dark command-center interface. High contrast for readability in various lighting conditions.
- **Typography:** Modern, clean, and highly legible (e.g., Inter, Roboto, or standard sans-serif). Excellent visual hierarchy emphasizing critical data points over labels.
- **Animations:** Smooth but restrained. Use micro-animations to indicate live data or state changes, but do not distract the operator.

## 3. Colors and Semantic States
Use color semantically and strictly to communicate system health:
- **Green:** Normal / Healthy.
- **Amber/Yellow:** Warning / Anomalous readings detected.
- **Red:** Critical / Immediate subsidence risk / Alert state.
- **Blue/Cyan:** Information / Active system elements / Navigation.

## 4. Dashboard Layout (Command Center)
- **Desktop-First:** Optimized for large screens used by mine operators.
- **Structure:** 
  - Global status header (overall mine health, active alerts).
  - Mine zone visualization (spatial or list-based mapping of nodes).
  - Real-time data streams and charts.
  - Alert feed/log.

## 5. Sensor Node Mobile UI
- **Mobile-First:** Optimized for smartphone screens.
- **Purpose:** Acts as the simulated field input device.
- **Interface:** Large, clear buttons to trigger specific demo readings (Normal, Warning, Critical) and real-time display of simulated output parameters (tilt, strain, etc.).

## 6. Charts & Data Visualization
- Utilize lightweight charting libraries (e.g., Recharts) to show trends in tilt, displacement, and vibration over time.
- Charts should clearly demarcate the safety thresholds (the line where Green turns to Yellow, and Yellow to Red).

## 7. SIH Presentation UX
The UX must support the presenter. Clear, unmistakable visual changes must occur when a zone shifts from Normal to Warning or Critical. Alerts must be highly visible so the evaluator immediately understands the system's value proposition.
