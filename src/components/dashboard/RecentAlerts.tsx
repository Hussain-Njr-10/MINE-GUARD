import { useTelemetry } from "../../hooks/useTelemetry";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { BellRing, Clock } from "lucide-react";

export function RecentAlerts() {
  const { alerts } = useTelemetry();
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 border-b border-mine-border/50">
        <CardTitle className="flex items-center gap-2">
          <BellRing className="text-semantic-cyan h-5 w-5" /> Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 p-0">
        <div className="divide-y divide-mine-border/50 max-h-[300px] overflow-y-auto">
          {alerts.map(alert => (
            <div key={alert.id} className="p-4 hover:bg-mine-dark/50 transition-colors border-l-2" style={{ borderLeftColor: alert.state === 'CRITICAL' ? '#ef4444' : '#f59e0b' }}>
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Badge variant={alert.state === 'CRITICAL' ? 'critical' : 'warning'}>{alert.state}</Badge>
                  <span className="text-sm font-medium text-mine-text">{alert.zone} — Node {alert.nodeId}</span>
                </div>
                <span className="text-xs text-mine-muted flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-mine-muted mt-2">{alert.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
