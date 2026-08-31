import { DashboardLayout } from "../layouts/DashboardLayout";
import { useTelemetry } from "../hooks/useTelemetry";
import { Badge } from "../components/ui/Badge";
import { AlertCircle, Clock, MapPin, Activity } from "lucide-react";

export function Alerts() {
  const { alerts } = useTelemetry();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-12">
        <div>
          <h1 className="text-3xl font-bold text-mine-text tracking-tight">System Alerts</h1>
          <p className="text-mine-muted mt-1">Recent warnings and critical events</p>
        </div>

        <div className="bg-mine-panel border border-mine-border rounded-xl p-4">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-mine-muted">
              <Activity className="h-12 w-12 mb-4 opacity-20" />
              <p>No active alerts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`flex flex-col sm:flex-row gap-4 p-4 rounded-lg border bg-mine-dark/50 ${
                    alert.state === 'CRITICAL' ? 'border-semantic-red/30' : 'border-semantic-amber/30'
                  }`}
                >
                  <div className="flex items-start pt-1">
                    <AlertCircle className={`h-6 w-6 ${alert.state === 'CRITICAL' ? 'text-semantic-red' : 'text-semantic-amber'}`} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-mine-text font-mono">{alert.nodeId}</span>
                        <Badge variant={alert.state === 'CRITICAL' ? 'critical' : 'warning'}>{alert.state}</Badge>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-mine-muted">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-mine-text">{alert.message}</p>
                    <div className="flex items-center gap-1 text-xs text-mine-muted">
                      <MapPin className="h-3 w-3" />
                      {alert.zone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
