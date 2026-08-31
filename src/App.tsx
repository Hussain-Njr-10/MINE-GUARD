import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CommandCenter } from "./pages/CommandCenter";
import { SensorNode } from "./pages/SensorNode";
import { LiveMonitoring } from "./pages/LiveMonitoring";
import { RiskMapPage } from "./pages/RiskMapPage";
import { Alerts } from "./pages/Alerts";
import { HistoricalData } from "./pages/HistoricalData";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CommandCenter />} />
        <Route path="/node/:id" element={<SensorNode />} />
        <Route path="/node" element={<Navigate to="/node/MG-05" replace />} />
        <Route path="/live" element={<LiveMonitoring />} />
        <Route path="/map" element={<RiskMapPage />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/history" element={<HistoricalData />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  )
}

export default App
