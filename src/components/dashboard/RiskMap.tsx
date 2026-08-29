import { useTelemetry } from "../../hooks/useTelemetry";
import type { NodeState, MineZone } from "../../types";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { cn } from "../../lib/utils";

const getStateColor = (state: NodeState) => {
  switch (state) {
    case 'NORMAL': return 'bg-semantic-green border-semantic-green/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
    case 'WATCH': return 'bg-semantic-cyan border-semantic-cyan/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]';
    case 'WARNING': return 'bg-semantic-amber border-semantic-amber/50 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse';
    case 'CRITICAL': return 'bg-semantic-red border-semantic-red/50 shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse';
    default: return 'bg-mine-muted border-mine-muted/50';
  }
};

const getBadgeVariant = (state: NodeState) => {
  switch (state) {
    case 'NORMAL': return 'success';
    case 'WATCH': return 'info';
    case 'WARNING': return 'warning';
    case 'CRITICAL': return 'critical';
    default: return 'default';
  }
};

const ZoneCard = ({ zone, className, selectedNodeId, onNodeSelect }: { zone?: MineZone, className?: string, selectedNodeId: string, onNodeSelect: (id: string) => void }) => {
  if (!zone) return null;
  return (
    <div className={cn("border border-mine-border/50 bg-mine-panel/80 backdrop-blur-sm rounded-lg p-3 transition-colors", className)}>
      <div className="flex items-center justify-between mb-2 border-b border-mine-border/30 pb-2">
        <h5 className="font-semibold text-mine-text text-[10px] sm:text-xs truncate" title={zone.name}>{zone.name}</h5>
        <Badge variant={getBadgeVariant(zone.overallState)} className="text-[9px] px-1 py-0">{zone.overallState}</Badge>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {zone.nodes.map(node => {
          const isSelected = node.id === selectedNodeId;
          return (
            <div 
              key={node.id} 
              onClick={() => onNodeSelect(node.id)}
              className={cn(
                "flex flex-col items-center justify-center p-1.5 rounded bg-mine-dark/80 border transition-all cursor-pointer group",
                isSelected ? "border-semantic-cyan shadow-[0_0_8px_rgba(6,182,212,0.4)] scale-110 z-10" : "border-mine-border hover:border-mine-muted hover:scale-105"
              )}
            >
              <div className={cn("w-3 h-3 rounded-full border-2 mb-1", getStateColor(node.state))} />
              <span className={cn("text-[9px] font-mono transition-colors", isSelected ? "text-semantic-cyan font-bold" : "text-mine-text group-hover:text-mine-text")}>{node.id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface RiskMapProps {
  selectedNodeId: string;
  onNodeSelect: (id: string) => void;
}

export function RiskMap({ selectedNodeId, onNodeSelect }: RiskMapProps) {
  const { zones } = useTelemetry();



  // Helper to easily grab a zone by ID
  const getZone = (id: string) => zones.find(z => z.id === id);

  return (
    <Card className="col-span-1 lg:col-span-2 flex flex-col h-full min-h-[400px]">
      <CardHeader className="pb-2 border-b border-mine-border/50">
        <div className="flex items-center justify-between">
          <CardTitle>Mine Spatial Risk Map</CardTitle>
          <div className="flex gap-3 text-xs text-mine-muted">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-semantic-green"></span> Normal</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-semantic-amber"></span> Warning</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-semantic-red"></span> Critical</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-mine-dark overflow-hidden">
        
        {/* Spatial Tunnel Layout Simulation */}
        <div className="absolute inset-0 p-4 md:p-6 overflow-y-auto">
          {/* Create a visual grid to simulate mine shafts */}
          <div className="w-full h-full min-h-[350px] relative">
            
            {/* Background Shaft Lines */}
            <div className="absolute top-1/2 left-0 right-0 h-8 bg-mine-border/20 -translate-y-1/2 border-y border-mine-border/30 rounded z-0"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-mine-border/20 -translate-x-1/2 border-x border-mine-border/30 rounded z-0"></div>

            {/* Zones positioned around the shafts */}
            <div className="grid grid-cols-2 grid-rows-3 gap-4 md:gap-8 h-full relative z-10">
              
              {/* Top Left */}
              <div className="flex items-end justify-end">
                <ZoneCard zone={getZone('Z-C')} className="w-full max-w-[200px]" selectedNodeId={selectedNodeId} onNodeSelect={onNodeSelect} />
              </div>
              
              {/* Top Right */}
              <div className="flex items-end justify-start">
                <ZoneCard zone={getZone('Z-D')} className="w-full max-w-[200px]" selectedNodeId={selectedNodeId} onNodeSelect={onNodeSelect} />
              </div>
              
              {/* Center Left */}
              <div className="flex items-center justify-end">
                <ZoneCard zone={getZone('Z-E')} className="w-full max-w-[200px] mt-4" selectedNodeId={selectedNodeId} onNodeSelect={onNodeSelect} />
              </div>
              
              {/* Center Right */}
              <div className="flex items-center justify-start">
                <ZoneCard zone={getZone('Z-B')} className="w-full max-w-[200px] mt-4" selectedNodeId={selectedNodeId} onNodeSelect={onNodeSelect} />
              </div>
              
              {/* Bottom Center (Spanning) */}
              <div className="col-span-2 flex items-start justify-center mt-4">
                <ZoneCard zone={getZone('Z-A')} className="w-full max-w-[300px]" selectedNodeId={selectedNodeId} onNodeSelect={onNodeSelect} />
              </div>
              
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
