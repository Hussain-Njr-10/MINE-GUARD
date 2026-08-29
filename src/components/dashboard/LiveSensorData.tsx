import { useTelemetry } from "../../hooks/useTelemetry";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Activity, Battery, Thermometer, ArrowUpRight, Maximize2, Zap } from "lucide-react";

interface LiveSensorDataProps {
  selectedNodeId: string;
}

export function LiveSensorData({ selectedNodeId }: LiveSensorDataProps) {
  const { getNode } = useTelemetry();
  const node = getNode(selectedNodeId);

  if (!node) return null;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 border-b border-mine-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RadioIcon /> Live Sensor Data
          </CardTitle>
          <Badge variant="critical" className="animate-pulse">LIVE</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold font-mono text-mine-text">{node.id}</h3>
            <p className="text-sm text-mine-muted">{node.zone}</p>
          </div>
          <div className="text-right">
            <Badge variant={node.state === 'CRITICAL' ? 'critical' : node.state === 'WARNING' ? 'warning' : 'success'}>{node.state}</Badge>
            <p className="text-xs text-mine-muted mt-1">Updated just now</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-mine-dark rounded border border-mine-border p-3 relative overflow-hidden flex flex-col justify-between">
            {(() => {
              const tiltSeverity = node.tilt >= 8 ? 'CRITICAL' : node.tilt >= 4 ? 'WARNING' : 'NORMAL';
              const tiltColor = tiltSeverity === 'CRITICAL' ? 'text-semantic-red' : tiltSeverity === 'WARNING' ? 'text-semantic-amber' : 'text-mine-text';
              return (
                <>
                  <div className={`absolute top-0 right-0 w-16 h-16 ${tiltSeverity === 'CRITICAL' ? 'bg-semantic-red/5' : tiltSeverity === 'WARNING' ? 'bg-semantic-amber/5' : ''} rounded-bl-full z-0`}></div>
                  <div className="flex items-center justify-between mb-1 relative z-10">
                    <p className="text-xs text-mine-muted flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Tilt</p>
                    {tiltSeverity !== 'NORMAL' && (
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${tiltSeverity === 'CRITICAL' ? 'bg-semantic-red/10 text-semantic-red border-semantic-red/30' : 'bg-semantic-amber/10 text-semantic-amber border-semantic-amber/30'}`}>
                        {tiltSeverity}
                      </span>
                    )}
                  </div>
                  <p className={`text-lg font-mono font-bold ${tiltColor} relative z-10`}>{node.tilt.toFixed(1)}°</p>
                </>
              );
            })()}
          </div>
          
          <div className="bg-mine-dark rounded border border-mine-border p-3 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 ${node.state === 'CRITICAL' ? 'bg-semantic-red/5' : 'bg-semantic-amber/5'} rounded-bl-full z-0`}></div>
            <p className="text-xs text-mine-muted mb-1 relative z-10 flex items-center gap-1"><Maximize2 className="h-3 w-3" /> Displacement</p>
            <p className={`text-lg font-mono font-bold ${node.state === 'CRITICAL' ? 'text-semantic-red' : node.state === 'WARNING' ? 'text-semantic-amber' : 'text-mine-text'} relative z-10`}>{node.displacement.toFixed(1)} mm</p>
          </div>
          
          <div className="bg-mine-dark rounded border border-mine-border p-3">
            <p className="text-xs text-mine-muted mb-1 flex items-center gap-1"><Activity className="h-3 w-3" /> Strain</p>
            <p className="text-lg font-mono font-bold text-semantic-amber">{node.strain} µε</p>
          </div>
          
          <div className="bg-mine-dark rounded border border-mine-border p-3">
            <p className="text-xs text-mine-muted mb-1 flex items-center gap-1"><Zap className="h-3 w-3" /> Vibration</p>
            <p className="text-lg font-mono font-bold text-semantic-amber">{node.vibration.toFixed(1)} mm/s</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm border-t border-mine-border/50 pt-4">
          <div className="flex items-center gap-1.5 text-mine-muted">
            <Thermometer className="h-4 w-4 text-semantic-amber" />
            <span>{node.temperature}°C</span>
          </div>
          <div className="flex items-center gap-1.5 text-mine-muted">
            <Battery className="h-4 w-4 text-semantic-red" />
            <span>{node.battery}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RadioIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-semantic-cyan"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>
  );
}
