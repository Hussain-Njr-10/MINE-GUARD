import type { Alert, MineZone, Recommendation, SensorNode, SystemStatus, TrendDataPoint } from '../types';

export const mockNodes: SensorNode[] = [
  { id: 'MG-01', zone: 'Zone A', state: 'NORMAL', battery: 98, lastUpdated: new Date().toISOString(), tilt: 1.2, displacement: 0.1, strain: 120, vibration: 0.5, temperature: 24 },
  { id: 'MG-02', zone: 'Zone A', state: 'NORMAL', battery: 95, lastUpdated: new Date().toISOString(), tilt: 1.1, displacement: 0.1, strain: 110, vibration: 0.4, temperature: 24 },
  { id: 'MG-03', zone: 'Zone A', state: 'NORMAL', battery: 89, lastUpdated: new Date().toISOString(), tilt: 1.3, displacement: 0.2, strain: 130, vibration: 0.6, temperature: 25 },
  
  { id: 'MG-04', zone: 'Zone C', state: 'WARNING', battery: 72, lastUpdated: new Date(Date.now() - 5000).toISOString(), tilt: 4.5, displacement: 2.1, strain: 450, vibration: 3.2, temperature: 28 },
  
  { id: 'MG-05', zone: 'Zone B', state: 'CRITICAL', battery: 45, lastUpdated: new Date(Date.now() - 2000).toISOString(), tilt: 8.9, displacement: 5.4, strain: 890, vibration: 7.8, temperature: 34 },
  { id: 'MG-06', zone: 'Zone B', state: 'WARNING', battery: 55, lastUpdated: new Date(Date.now() - 4000).toISOString(), tilt: 5.2, displacement: 2.8, strain: 520, vibration: 4.1, temperature: 31 },
  { id: 'MG-07', zone: 'Zone B', state: 'WATCH', battery: 60, lastUpdated: new Date().toISOString(), tilt: 2.8, displacement: 1.1, strain: 290, vibration: 1.8, temperature: 27 },
  
  { id: 'MG-08', zone: 'Zone D', state: 'NORMAL', battery: 91, lastUpdated: new Date().toISOString(), tilt: 1.0, displacement: 0.0, strain: 105, vibration: 0.3, temperature: 23 },
  { id: 'MG-09', zone: 'Zone D', state: 'NORMAL', battery: 88, lastUpdated: new Date().toISOString(), tilt: 1.4, displacement: 0.3, strain: 140, vibration: 0.7, temperature: 24 },
  { id: 'MG-10', zone: 'Zone D', state: 'WARNING', battery: 67, lastUpdated: new Date(Date.now() - 10000).toISOString(), tilt: 4.1, displacement: 1.9, strain: 410, vibration: 2.9, temperature: 29 },
  
  { id: 'MG-11', zone: 'Zone E', state: 'NORMAL', battery: 94, lastUpdated: new Date().toISOString(), tilt: 1.1, displacement: 0.1, strain: 115, vibration: 0.4, temperature: 23 },
  { id: 'MG-12', zone: 'Zone E', state: 'NORMAL', battery: 97, lastUpdated: new Date().toISOString(), tilt: 0.9, displacement: 0.0, strain: 95, vibration: 0.2, temperature: 22 },
];

export const mockZones: MineZone[] = [
  { id: 'Z-A', name: 'Zone A (Main Haulage)', overallState: 'NORMAL', nodes: mockNodes.filter(n => n.zone === 'Zone A') },
  { id: 'Z-B', name: 'Zone B (Panel 4)', overallState: 'CRITICAL', nodes: mockNodes.filter(n => n.zone === 'Zone B') },
  { id: 'Z-C', name: 'Zone C (Ventilation Shaft 2)', overallState: 'WARNING', nodes: mockNodes.filter(n => n.zone === 'Zone C') },
  { id: 'Z-D', name: 'Zone D (Panel 5)', overallState: 'WARNING', nodes: mockNodes.filter(n => n.zone === 'Zone D') },
  { id: 'Z-E', name: 'Zone E (Access Drift)', overallState: 'NORMAL', nodes: mockNodes.filter(n => n.zone === 'Zone E') },
];

export const mockSystemStatus: SystemStatus = {
  overallRisk: 68,
  activeNodes: 12,
  criticalAlerts: 3,
  warnings: 5,
  gatewayStatus: 'ONLINE',
  backendStatus: 'ONLINE'
};

export const mockAlerts: Alert[] = [
  { id: 'A-1', nodeId: 'MG-05', zone: 'Zone B', state: 'CRITICAL', message: 'Risk score reached 91% - High displacement & tilt', timestamp: new Date(Date.now() - 60000).toISOString() },
  { id: 'A-2', nodeId: 'MG-10', zone: 'Zone D', state: 'WARNING', message: 'Risk score reached 67% - Vibration anomaly', timestamp: new Date(Date.now() - 360000).toISOString() },
  { id: 'A-3', nodeId: 'MG-04', zone: 'Zone C', state: 'WARNING', message: 'Risk score reached 62% - Elevated strain', timestamp: new Date(Date.now() - 720000).toISOString() },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'R-1',
    title: 'IMMEDIATE INSPECTION REQUIRED',
    nodeId: 'MG-05',
    zone: 'Zone B',
    reasons: [
      'Rapid increase in displacement (>5mm)',
      'High strain detected (890 µε)',
      'Abnormal vibration (7.8 mm/s)'
    ],
    actions: [
      'Halt operations in Panel 4',
      'Inspect support structure immediately',
      'Check for roof instability',
      'Monitor continuously via Command Center'
    ]
  }
];

// Generate some mock trend data leading up to the critical state for MG-05
export const mockTrendData: TrendDataPoint[] = Array.from({ length: 24 }).map((_, i) => {
  const isRecent = i > 18;
  const time = new Date(Date.now() - (24 - i) * 5 * 60000); // 5 min intervals
  
  return {
    time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tilt: isRecent ? 1.5 + Math.pow(i - 18, 1.5) : 1.2 + Math.random() * 0.4,
    displacement: isRecent ? 0.2 + Math.pow(i - 18, 1.2) : 0.1 + Math.random() * 0.2,
    strain: isRecent ? 150 + Math.pow(i - 18, 2.5) * 10 : 120 + Math.random() * 30,
    vibration: isRecent ? 0.6 + Math.pow(i - 18, 1.4) : 0.5 + Math.random() * 0.3,
  };
});
