import { useState, useEffect, useCallback } from 'react';
import type { SensorNode, SystemStatus, MineZone, Alert, Recommendation, TrendDataPoint, NodeState } from '../types';
import { simulationEngine } from '../services/SimulationEngine';

export function useTelemetry() {
  const [state, setState] = useState(() => {
    return {
      nodes: [] as SensorNode[],
      zones: [] as MineZone[],
      systemStatus: {
        overallRisk: 12,
        activeNodes: 0,
        criticalAlerts: 0,
        warnings: 0,
        gatewayStatus: 'ONLINE' as 'ONLINE' | 'OFFLINE' | 'DEGRADED',
        backendStatus: 'ONLINE' as 'ONLINE' | 'OFFLINE' | 'DEGRADED',
      } as SystemStatus,
      alerts: [] as Alert[],
      recommendations: [] as Recommendation[],
      trendData: {} as Record<string, TrendDataPoint[]>
    };
  });

  useEffect(() => {
    const unsubscribe = simulationEngine.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getNode = useCallback((id: string) => {
    return state.nodes.find(n => n.id === id);
  }, [state.nodes]);

  const updateNodeState = useCallback((id: string, newState: NodeState) => {
    simulationEngine.setNodeState(id, newState);
  }, []);

  return {
    nodes: state.nodes,
    zones: state.zones,
    systemStatus: state.systemStatus,
    alerts: state.alerts,
    recommendations: state.recommendations,
    trendData: state.trendData,
    getNode,
    updateNodeState
  };
}
