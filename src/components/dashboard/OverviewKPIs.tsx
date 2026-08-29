import { useTelemetry } from "../../hooks/useTelemetry";
import { Card, CardContent } from "../ui/Card";
import { Activity, Radio, AlertTriangle, ShieldAlert } from "lucide-react";

export function OverviewKPIs() {
  const { systemStatus } = useTelemetry();
  const { overallRisk, activeNodes, criticalAlerts, warnings } = systemStatus;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-semantic-amber/10 flex items-center justify-center text-semantic-amber">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-mine-muted font-medium mb-1">Overall Mine Risk</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold text-mine-text">{overallRisk}%</h4>
              <span className="text-xs text-semantic-amber font-medium">ELEVATED</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-semantic-cyan/10 flex items-center justify-center text-semantic-cyan">
            <Radio className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-mine-muted font-medium mb-1">Active Nodes</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold text-mine-text">{activeNodes}</h4>
              <span className="text-xs text-semantic-green font-medium">ONLINE</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-semantic-red/10 flex items-center justify-center text-semantic-red">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-mine-muted font-medium mb-1">Critical Alerts</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold text-mine-text">{criticalAlerts}</h4>
              <span className="text-xs text-mine-muted font-medium">unresolved</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-semantic-amber/10 flex items-center justify-center text-semantic-amber">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-mine-muted font-medium mb-1">Warnings</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold text-mine-text">{warnings}</h4>
              <span className="text-xs text-mine-muted font-medium">active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
