import { DashboardLayout } from "../layouts/DashboardLayout";
import { useTelemetry } from "../hooks/useTelemetry";
import { Badge } from "../components/ui/Badge";
import { useNavigate } from "react-router-dom";

export function LiveMonitoring() {
  const { nodes } = useTelemetry();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-12">
        <div>
          <h1 className="text-3xl font-bold text-mine-text tracking-tight">Live Monitoring</h1>
          <p className="text-mine-muted mt-1">Real-time telemetry from all active sensor nodes</p>
        </div>

        <div className="bg-mine-panel border border-mine-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-mine-dark/50 border-b border-mine-border text-mine-muted uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Node</th>
                  <th className="px-6 py-4 font-semibold">Zone</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Tilt (°)</th>
                  <th className="px-6 py-4 font-semibold text-right">Disp (mm)</th>
                  <th className="px-6 py-4 font-semibold text-right">Strain (µε)</th>
                  <th className="px-6 py-4 font-semibold text-right">Vib (mm/s)</th>
                  <th className="px-6 py-4 font-semibold text-right">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mine-border/50">
                {nodes.map(node => (
                  <tr 
                    key={node.id} 
                    onClick={() => navigate(`/node/${node.id}`)}
                    className="hover:bg-mine-dark/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-mine-text group-hover:text-semantic-cyan transition-colors">{node.id}</td>
                    <td className="px-6 py-4 text-mine-muted">{node.zone}</td>
                    <td className="px-6 py-4">
                      <Badge variant={node.state === 'CRITICAL' ? 'critical' : node.state === 'WARNING' ? 'warning' : 'success'}>
                        {node.state}
                      </Badge>
                    </td>
                    <td className={`px-6 py-4 text-right font-mono ${node.tilt > 5 ? 'text-semantic-red font-bold' : node.tilt > 2 ? 'text-semantic-amber font-bold' : 'text-mine-text'}`}>{node.tilt.toFixed(1)}</td>
                    <td className={`px-6 py-4 text-right font-mono ${node.displacement > 4 ? 'text-semantic-red font-bold' : node.displacement > 1.5 ? 'text-semantic-amber font-bold' : 'text-mine-text'}`}>{node.displacement.toFixed(1)}</td>
                    <td className={`px-6 py-4 text-right font-mono ${node.strain > 600 ? 'text-semantic-red font-bold' : node.strain > 300 ? 'text-semantic-amber font-bold' : 'text-mine-text'}`}>{node.strain}</td>
                    <td className={`px-6 py-4 text-right font-mono ${node.vibration > 5 ? 'text-semantic-red font-bold' : node.vibration > 2 ? 'text-semantic-amber font-bold' : 'text-mine-text'}`}>{node.vibration.toFixed(1)}</td>
                    <td className="px-6 py-4 text-right text-mine-muted text-xs">
                      {new Date(node.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
