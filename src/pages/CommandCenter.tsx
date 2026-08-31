import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { OverviewKPIs } from "../components/dashboard/OverviewKPIs";
import { RiskMap } from "../components/dashboard/RiskMap";
import { LiveSensorData } from "../components/dashboard/LiveSensorData";
import { TrendChart } from "../components/dashboard/TrendChart";
import { RiskPrediction } from "../components/dashboard/RiskPrediction";
import { RecentAlerts } from "../components/dashboard/RecentAlerts";
import { Recommendations } from "../components/dashboard/Recommendations";

export function CommandCenter() {
  const [selectedNodeId, setSelectedNodeId] = useState("MG-05");

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-12">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-mine-text tracking-tight">Command Center</h1>
          <p className="text-mine-muted mt-1">Real-time Mine Subsidence Monitoring & Early Warning System</p>
        </div>

        {/* KPIs */}
        <OverviewKPIs />

        {/* Main Grid: Map & Live Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RiskMap selectedNodeId={selectedNodeId} onNodeSelect={setSelectedNodeId} />
          <div className="col-span-1 flex flex-col gap-6">
            <LiveSensorData selectedNodeId={selectedNodeId} />
            <RiskPrediction />
          </div>
        </div>

        {/* Secondary Grid: Charts & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TrendChart selectedNodeId={selectedNodeId} />
          <RecentAlerts />
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 gap-6">
          <Recommendations />
        </div>
      </div>
    </DashboardLayout>
  );
}
