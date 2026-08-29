import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Activity } from "lucide-react";
import { useTelemetry } from '../../hooks/useTelemetry';

// Custom tooltip formatter
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-mine-dark border border-mine-border p-3 rounded-lg shadow-lg">
        <p className="text-mine-text font-mono text-xs mb-2 border-b border-mine-border/50 pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-xs font-medium flex items-center justify-between gap-4">
            <span className="capitalize">{entry.name}:</span>
            <span className="font-mono font-bold">
              {Number(entry.value).toFixed(2)} {entry.name === 'tilt' ? '°' : 'mm'}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function TrendChart() {
  const { trendData } = useTelemetry();

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-2 border-b border-mine-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="text-semantic-cyan h-5 w-5" /> Node MG-05 Live Telemetry Trend
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTilt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDisp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            
            <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'WARNING THRESHOLD', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'CRITICAL THRESHOLD', fill: '#ef4444', fontSize: 10 }} />

            <Area type="monotone" name="Tilt (°)" dataKey="tilt" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorTilt)" isAnimationActive={false} />
            <Area type="monotone" name="Displacement (mm)" dataKey="displacement" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorDisp)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
