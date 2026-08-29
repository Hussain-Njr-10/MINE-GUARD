import { useTelemetry } from "../../hooks/useTelemetry";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export function Recommendations() {
  const { recommendations } = useTelemetry();
  const rec = recommendations[0] || { title: "No recommendations", zone: "N/A", nodeId: "N/A", reasons: [], actions: [] };

  return (
    <Card className="h-full border-semantic-amber/50 bg-gradient-to-br from-mine-panel to-semantic-amber/5">
      <CardHeader className="pb-2 border-b border-mine-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-semantic-amber">
            <ShieldCheck className="h-5 w-5" /> Safety Recommendations
          </CardTitle>
          <span className="text-[10px] uppercase tracking-wider text-mine-muted border border-mine-border rounded px-2 py-0.5">Prototype</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <h4 className="text-semantic-red font-bold text-sm tracking-wide mb-1">{rec.title}</h4>
          <p className="text-mine-text text-sm font-medium">{rec.zone} — Node {rec.nodeId}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h5 className="text-xs font-semibold text-mine-muted uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-semantic-red" /> Reasons
            </h5>
            <ul className="space-y-1.5">
              {rec.reasons.map((reason, idx) => (
                <li key={idx} className="text-sm text-mine-text flex items-start gap-2">
                  <span className="text-semantic-red mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="text-xs font-semibold text-mine-muted uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-semantic-green" /> Suggested Actions
            </h5>
            <ul className="space-y-1.5">
              {rec.actions.map((action, idx) => (
                <li key={idx} className="text-sm text-semantic-cyan flex items-start gap-2">
                  <span className="text-semantic-cyan mt-0.5">→</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
