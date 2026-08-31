import type { SensorNode, MineZone, SystemStatus, Alert, Recommendation, TrendDataPoint, NodeState } from '../types';
import { mockNodes, mockZones, mockSystemStatus, mockAlerts, mockRecommendations, mockTrendData } from '../data/mockData';
import { commService } from './CommunicationService';
import type { TelemetryMessage } from './CommunicationService';

type SimulationState = {
  nodes: SensorNode[];
  zones: MineZone[];
  systemStatus: SystemStatus;
  alerts: Alert[];
  recommendations: Recommendation[];
  trendData: Record<string, TrendDataPoint[]>;
};

type StateListener = (state: SimulationState) => void;

class SimulationEngine {
  private state: SimulationState;
  private listeners: Set<StateListener> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isRunning: boolean = true;
  private updateIntervalMs: number = 3000;

  // Track nodes that are being driven by physical devices / remote MQTT
  // If a node receives a real update, we pause simulation drift for it for 15 seconds
  private hardwareOverrides: Record<string, number> = {};

  // Base values for nodes to drift around when NORMAL
  private baseValues: Record<string, { tilt: number; displacement: number; strain: number; vibration: number }> = {};

  constructor() {
    this.state = {
      nodes: JSON.parse(JSON.stringify(mockNodes)),
      zones: JSON.parse(JSON.stringify(mockZones)),
      systemStatus: JSON.parse(JSON.stringify(mockSystemStatus)),
      alerts: JSON.parse(JSON.stringify(mockAlerts)),
      recommendations: JSON.parse(JSON.stringify(mockRecommendations)),
      trendData: {},
    };

    // Initialize base values and trend data
    this.state.nodes.forEach(node => {
      this.baseValues[node.id] = {
        tilt: node.tilt,
        displacement: node.displacement,
        strain: node.strain,
        vibration: node.vibration
      };
      
      // Initialize with baseline trend data or mock data for MG-05
      if (node.id === 'MG-05') {
          this.state.trendData[node.id] = JSON.parse(JSON.stringify(mockTrendData));
      } else {
          // Generate a flat-ish baseline for others
          this.state.trendData[node.id] = Array.from({ length: 24 }).map((_, i) => {
             const time = new Date(Date.now() - (24 - i) * 5 * 60000);
             return {
                 time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                 tilt: node.tilt + (Math.random() - 0.5) * 0.1,
                 displacement: node.displacement + (Math.random() - 0.5) * 0.1,
                 strain: node.strain + (Math.random() - 0.5) * 5,
                 vibration: node.vibration + (Math.random() - 0.5) * 0.1,
             }
          });
      }
    });

    // Listen to real hardware / remote MQTT updates
    commService.subscribe((msg: TelemetryMessage) => {
      if (msg.type === 'SENSOR_READING' && msg.payload) {
        this.handleExternalReading(msg.payload);
      } else if (msg.type === 'DEMO_RESET') {
        // Optional: Reset state if needed
      }
    });

    if (this.isRunning) {
      this.start();
    }
  }

  private handleExternalReading(nodePayload: SensorNode) {
    const index = this.state.nodes.findIndex(n => n.id === nodePayload.id);
    if (index === -1) return;

    // Mark this node as hardware-overridden (pause fake drift for 15s)
    this.hardwareOverrides[nodePayload.id] = Date.now() + 15000;

    const oldState = this.state.nodes[index].state;
    
    // Always recalculate state based on the raw sensor values coming from hardware
    const calculatedState = this.calculateStatus(nodePayload);
    nodePayload.state = calculatedState;
    
    this.state.nodes[index] = nodePayload;

    if (nodePayload.state !== oldState && (nodePayload.state === 'WARNING' || nodePayload.state === 'CRITICAL')) {
      this.generateAlert(nodePayload);
    }

    this.updateZones();
    this.updateSystemStatus();
    this.notifyListeners();
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    // Initial call
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const stateCopy = { ...this.state };
    this.listeners.forEach(l => l(stateCopy));
  }

  public start() {
    if (this.intervalId) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => this.tick(), this.updateIntervalMs);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  public setUpdateInterval(ms: number) {
    this.updateIntervalMs = ms;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  private tick() {
    const now = new Date().toISOString();

    const updatedNodes = this.state.nodes.map(node => {
      // Check if this node is currently overridden by a real device (MQTT)
      if (this.hardwareOverrides[node.id] && Date.now() < this.hardwareOverrides[node.id]) {
        return node; // Skip random drift and just return the real device's value
      }

      // Small random drift
      const drift = () => (Math.random() - 0.5) * 0.1;
      
      let newTilt = node.tilt;
      let newDisp = node.displacement;
      let newStrain = node.strain;
      let newVib = node.vibration;

      // Make changes realistic based on current state
      if (node.state === 'NORMAL') {
        newTilt = Math.max(0, this.baseValues[node.id].tilt + drift() * 0.5);
        newDisp = Math.max(0, this.baseValues[node.id].displacement + drift() * 0.2);
        newStrain = Math.max(0, this.baseValues[node.id].strain + drift() * 20);
        newVib = Math.max(0, this.baseValues[node.id].vibration + drift() * 0.5);
      } else if (node.state === 'WARNING') {
        newTilt = node.tilt + drift() * 0.8;
        newDisp = node.displacement + drift() * 0.5;
        newStrain = node.strain + drift() * 30;
        newVib = node.vibration + drift() * 0.8;
      } else if (node.state === 'CRITICAL') {
        newTilt = node.tilt + Math.abs(drift() * 1.5); // Tend to increase
        newDisp = node.displacement + Math.abs(drift() * 1.0);
        newStrain = node.strain + Math.abs(drift() * 50);
        newVib = node.vibration + Math.abs(drift() * 1.5);
      }

      // Slightly decrease battery
      const newBattery = Math.max(0, node.battery - (Math.random() * 0.05));
      
      const updatedNode = {
        ...node,
        tilt: Number(newTilt.toFixed(2)),
        displacement: Number(newDisp.toFixed(2)),
        strain: Math.round(newStrain),
        vibration: Number(newVib.toFixed(2)),
        battery: Number(newBattery.toFixed(1)),
        lastUpdated: now
      };

      // Recalculate status based on thresholds
      const newState = this.calculateStatus(updatedNode);
      if (newState !== updatedNode.state) {
        updatedNode.state = newState;
        this.generateAlert(updatedNode);
      }

      return updatedNode;
    });

    this.state.nodes = updatedNodes;
    this.updateZones();
    this.updateSystemStatus();
    this.updateTrendData();

    this.notifyListeners();
  }

  private calculateStatus(node: SensorNode): NodeState {
    const riskScore = this.calculateRiskScore(node);
    if (riskScore >= 75) return 'CRITICAL';
    if (riskScore >= 50) return 'WARNING';
    if (riskScore >= 25) return 'WATCH';
    return 'NORMAL';
  }

  public calculateRiskScore(node: SensorNode): number {
    // Conceptual weights:
    // Tilt (25%), Displacement (30%), Strain (20%), Vibration (15%) + Base threshold maxing out
    const tiltRisk = Math.min(node.tilt / 8, 1) * 25;
    const dispRisk = Math.min(node.displacement / 5, 1) * 30;
    const strainRisk = Math.min(node.strain / 800, 1) * 20;
    const vibRisk = Math.min(node.vibration / 7, 1) * 15;
    
    // Total out of 90 (leaving 10% for rate of change conceptually)
    let score = tiltRisk + dispRisk + strainRisk + vibRisk;
    // Add a baseline risk for simply being active, up to 10
    score += (Math.random() * 5 + 5); 
    
    return Math.min(100, Math.round(score));
  }

  private updateZones() {
    const updatedZones = this.state.zones.map(zone => {
      const zoneNameBase = zone.name.split(' (')[0]; // e.g. "Zone A"
      const zoneNodes = this.state.nodes.filter(n => n.zone === zoneNameBase);
      const hasCritical = zoneNodes.some(n => n.state === 'CRITICAL');
      const hasWarning = zoneNodes.some(n => n.state === 'WARNING');
      const hasWatch = zoneNodes.some(n => n.state === 'WATCH');
      
      let overallState: NodeState = 'NORMAL';
      if (hasCritical) overallState = 'CRITICAL';
      else if (hasWarning) overallState = 'WARNING';
      else if (hasWatch) overallState = 'WATCH';

      return {
        ...zone,
        nodes: zoneNodes,
        overallState
      };
    });
    this.state.zones = updatedZones;
  }

  private updateSystemStatus() {
    const criticalNodes = this.state.nodes.filter(n => n.state === 'CRITICAL').length;
    const warningNodes = this.state.nodes.filter(n => n.state === 'WARNING').length;

    // Calculate dynamic overall risk based on the highest individual node risks
    const allRisks = this.state.nodes.map(n => this.calculateRiskScore(n));
    allRisks.sort((a, b) => b - a);
    
    // Weighted average of the top 3 risk scores (gives a dynamic but smooth overall system risk)
    let dynamicRisk = 12;
    if (allRisks.length > 0) {
       dynamicRisk = (allRisks[0] * 0.6) + ((allRisks[1] || 0) * 0.3) + ((allRisks[2] || 0) * 0.1);
    }

    // Add a tiny bit of random jitter so it constantly updates and feels "live"
    dynamicRisk += (Math.random() - 0.5) * 2;

    this.state.systemStatus = {
      ...this.state.systemStatus,
      overallRisk: Math.max(0, Math.min(100, Math.round(dynamicRisk))),
      activeNodes: this.state.nodes.length,
      criticalAlerts: criticalNodes,
      warnings: warningNodes
    };
  }

  private updateTrendData() {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    this.state.nodes.forEach(node => {
        const newPoint: TrendDataPoint = {
            time,
            tilt: node.tilt,
            displacement: node.displacement,
            strain: node.strain,
            vibration: node.vibration
        };
        const newTrend = [...(this.state.trendData[node.id] || []), newPoint];
        if (newTrend.length > 24) {
            newTrend.shift();
        }
        this.state.trendData[node.id] = newTrend;
    });
  }

  private generateAlert(node: SensorNode) {
    if (node.state === 'NORMAL' || node.state === 'WATCH') return; // Don't alert for these

    const riskScore = this.calculateRiskScore(node);
    let reason = '';
    if (node.displacement > 4) reason = 'High displacement';
    else if (node.tilt > 5) reason = 'High tilt';
    else if (node.vibration > 5) reason = 'Vibration anomaly';
    else if (node.strain > 600) reason = 'Elevated strain';
    else reason = 'Threshold breached';

    const newAlert: Alert = {
      id: `A-${Date.now()}`,
      nodeId: node.id,
      zone: node.zone,
      state: node.state,
      message: `Risk score reached ${riskScore}% - ${reason}`,
      timestamp: new Date().toISOString()
    };

    this.state.alerts = [newAlert, ...this.state.alerts].slice(0, 20);
  }

  public setNodeState(nodeId: string, newState: NodeState) {
    const nodeIndex = this.state.nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return;

    const node = this.state.nodes[nodeIndex];
    let newTilt = node.tilt;
    let newDisp = node.displacement;
    let newStrain = node.strain;
    let newVib = node.vibration;

    if (newState === 'NORMAL') {
      newTilt = 1.1;
      newDisp = 0.5;
      newStrain = 200;
      newVib = 1.0;
    } else if (newState === 'WARNING') {
      newTilt = 4.5;
      newDisp = 2.5;
      newStrain = 500;
      newVib = 3.5;
    } else if (newState === 'CRITICAL') {
      newTilt = 8.5;
      newDisp = 5.2;
      newStrain = 850;
      newVib = 7.5;
    }

    const updatedNode: SensorNode = {
        ...node,
        state: newState,
        tilt: newTilt,
        displacement: newDisp,
        strain: newStrain,
        vibration: newVib,
        lastUpdated: new Date().toISOString()
    };

    this.state.nodes[nodeIndex] = updatedNode;
    
    // Broadcast this manual override to all other devices viewing the dashboard via MQTT
    commService.publishReading(updatedNode);
    
    if (newState === 'WARNING' || newState === 'CRITICAL') {
        this.generateAlert(updatedNode);
    }

    this.updateZones();
    this.updateSystemStatus();
    this.notifyListeners();
  }

  public getSimulationState() {
      return {
          isRunning: this.isRunning,
          updateIntervalMs: this.updateIntervalMs
      }
  }
}

export const simulationEngine = new SimulationEngine();
