import { useTelemetry } from "../../hooks/useTelemetry";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { BrainCircuit, TrendingUp, AlertOctagon } from "lucide-react";

export function RiskPrediction() {
  const { systemStatus } = useTelemetry();
  const riskScore = systemStatus.overallRisk;

  return (
    <Card className={`h-full border-t-[3px] shadow-lg bg-gradient-to-b from-mine-panel to-mine-dark ${riskScore >= 90 ? 'border-t-semantic-red shadow-[0_0_15px_rgba(239,68,68,0.15)]' : riskScore >= 70 ? 'border-t-semantic-amber shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-t-semantic-green shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}>
      <CardHeader className="pb-2 border-b border-mine-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 ${riskScore >= 90 ? 'text-semantic-red' : riskScore >= 70 ? 'text-semantic-amber' : 'text-semantic-green'}`}>
            <BrainCircuit className="h-5 w-5" /> Prototype Risk Analysis
          </CardTitle>
          <span className="text-[10px] uppercase tracking-wider text-mine-muted border border-mine-border rounded px-2 py-0.5">Demo Engine</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Mock circular progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="transparent" stroke="#334155" strokeWidth="8" />
              <circle 
                cx="64" cy="64" r="56" fill="transparent" 
                stroke={riskScore >= 90 ? '#ef4444' : riskScore >= 70 ? '#f59e0b' : '#10b981'} 
                strokeWidth="8" strokeDasharray="351" strokeDashoffset={351 - (351 * riskScore) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono text-white">{riskScore}<span className="text-xl">%</span></span>
              <span className="text-[10px] text-mine-muted uppercase tracking-widest">Risk Score</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className={`flex items-center justify-between p-3 rounded bg-mine-dark border ${riskScore >= 90 ? 'border-semantic-red/30' : riskScore >= 70 ? 'border-semantic-amber/30' : 'border-semantic-green/30'}`}>
            <div className="flex items-center gap-2">
              <AlertOctagon className={`h-4 w-4 ${riskScore >= 90 ? 'text-semantic-red' : riskScore >= 70 ? 'text-semantic-amber' : 'text-semantic-green'}`} />
              <span className="text-sm font-medium">Status</span>
            </div>
            <span className={`text-sm font-bold ${riskScore >= 90 ? 'text-semantic-red' : riskScore >= 70 ? 'text-semantic-amber' : 'text-semantic-green'}`}>
              {riskScore >= 90 ? 'CRITICAL RISK' : riskScore >= 70 ? 'ELEVATED RISK' : 'NORMAL'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-mine-dark border border-mine-border">
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-4 w-4 ${riskScore >= 90 ? 'text-semantic-red' : riskScore >= 70 ? 'text-semantic-amber' : 'text-semantic-green'}`} />
              <span className="text-sm font-medium">Trend</span>
            </div>
            <span className={`text-sm font-medium ${riskScore >= 90 ? 'text-semantic-red' : riskScore >= 70 ? 'text-semantic-amber' : 'text-semantic-green'}`}>
              {riskScore >= 90 ? 'Increasing Rapidly' : riskScore >= 70 ? 'Elevated' : 'Stable'}
            </span>
          </div>

          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs text-mine-muted">Confidence Level</span>
            <span className="text-xs font-mono text-semantic-cyan">92%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
