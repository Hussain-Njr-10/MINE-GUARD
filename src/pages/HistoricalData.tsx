import { DashboardLayout } from "../layouts/DashboardLayout";
import { useTelemetry } from "../hooks/useTelemetry";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { History, Download } from "lucide-react";

export function HistoricalData() {
  const { trendData } = useTelemetry();
  // We can just show MG-05 as the default historical view
  const data = trendData['MG-05'] || [];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-mine-text tracking-tight">Historical Data</h1>
            <p className="text-mine-muted mt-1">Long-term trend analysis for subsidence prediction</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-semantic-cyan/10 text-semantic-cyan border border-semantic-cyan/30 rounded hover:bg-semantic-cyan/20 transition-colors text-sm font-bold tracking-widest">
            <Download className="h-4 w-4" /> EXPORT CSV
          </button>
        </div>

        <Card className="col-span-1 lg:col-span-2 bg-mine-panel/50">
          <CardHeader className="pb-2 border-b border-mine-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <History className="text-semantic-cyan h-5 w-5" /> Node MG-05 Last 24 Hours
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend />
                <Line type="monotone" dataKey="tilt" stroke="#ef4444" strokeWidth={2} dot={false} name="Tilt (°)" />
                <Line type="monotone" dataKey="displacement" stroke="#3b82f6" strokeWidth={2} dot={false} name="Disp (mm)" />
                <Line type="monotone" dataKey="vibration" stroke="#f59e0b" strokeWidth={2} dot={false} name="Vib (mm/s)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
