export type NodeState = 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';

export interface SensorNode {
  id: string;
  zone: string;
  state: NodeState;
  battery: number;
  lastUpdated: string; // ISO string
  tilt: number; // degrees
  displacement: number; // mm
  strain: number; // microstrain
  vibration: number; // mm/s
  temperature: number; // Celsius
}

export interface Alert {
  id: string;
  nodeId: string;
  zone: string;
  state: NodeState;
  message: string;
  timestamp: string; // ISO string
}

export interface Recommendation {
  id: string;
  title: string;
  nodeId: string;
  zone: string;
  reasons: string[];
  actions: string[];
}

export interface SystemStatus {
  overallRisk: number; // percentage
  activeNodes: number;
  criticalAlerts: number;
  warnings: number;
  gatewayStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  backendStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
}

export interface MineZone {
  id: string;
  name: string;
  nodes: SensorNode[];
  overallState: NodeState;
}

export interface TrendDataPoint {
  time: string;
  tilt: number;
  displacement: number;
  strain: number;
  vibration: number;
}
