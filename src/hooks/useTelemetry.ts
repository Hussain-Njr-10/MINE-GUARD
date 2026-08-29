import { useState, useEffect, useCallback } from 'react';
import type { SensorNode, SystemStatus, MineZone, Alert, Recommendation, TrendDataPoint } from '../types';
import { mockNodes, mockSystemStatus, mockZones, mockAlerts, mockRecommendations, mockTrendData } from '../data/mockData';
import { commService } from '../services/CommunicationService';
import type { TelemetryMessage } from '../services/CommunicationService';

export function useTelemetry() {
  const [nodes, setNodes] = useState<SensorNode[]>(mockNodes);
  const [zones, setZones] = useState<MineZone[]>(mockZones);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(mockSystemStatus);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [recommendations] = useState<Recommendation[]>(mockRecommendations);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>(mockTrendData);

  useEffect(() => {
    // Subscribe to incoming telemetry from the mock data communication layer
    const unsubscribe = commService.subscribe((msg: TelemetryMessage) => {
      if (msg.type === 'SENSOR_READING') {
        const updatedNode = msg.payload;
        
        setNodes(currentNodes => {
          return currentNodes.map(node => 
            node.id === updatedNode.id ? updatedNode : node
          );
        });
        
        // Update Trend Data if the node is MG-05 (the one we are graphing)
        if (updatedNode.id === 'MG-05') {
          setTrendData(currentTrend => {
            const newPoint: TrendDataPoint = {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              tilt: updatedNode.tilt,
              displacement: updatedNode.displacement,
              strain: updatedNode.strain,
              vibration: updatedNode.vibration
            };
            // Keep last 24 points
            const newTrend = [...currentTrend, newPoint];
            if (newTrend.length > 24) {
              newTrend.shift();
            }
            return newTrend;
          });
        }
        
        // Push a new alert if the reading is Warning or Critical
        if (updatedNode.state === 'WARNING' || updatedNode.state === 'CRITICAL') {
          setAlerts(currentAlerts => {
            // Prevent spamming the exact same alert state for the same node
            const lastNodeAlert = currentAlerts.find(a => a.nodeId === updatedNode.id);
            if (lastNodeAlert && lastNodeAlert.state === updatedNode.state) {
              return currentAlerts;
            }

            const newAlert: Alert = {
              id: `A-${Date.now()}`,
              nodeId: updatedNode.id,
              zone: updatedNode.zone,
              state: updatedNode.state,
              message: `Automated alert: ${updatedNode.state} threshold breached.`,
              timestamp: new Date().toISOString()
            };
            return [newAlert, ...currentAlerts].slice(0, 20); // keep top 20
          });
        }

        // Also update the zone states (Risk logic)
        setZones(currentZones => {
          return currentZones.map(zone => {
            if (zone.id === `Z-${updatedNode.zone.replace('Zone ', '')}`) {
              const updatedNodesList = zone.nodes.map(n => n.id === updatedNode.id ? updatedNode : n);
              // Calculate overall zone state
              const hasCritical = updatedNodesList.some(n => n.state === 'CRITICAL');
              const hasWarning = updatedNodesList.some(n => n.state === 'WARNING');
              const hasWatch = updatedNodesList.some(n => n.state === 'WATCH');
              
              let newOverallState = zone.overallState;
              if (hasCritical) newOverallState = 'CRITICAL';
              else if (hasWarning) newOverallState = 'WARNING';
              else if (hasWatch) newOverallState = 'WATCH';
              else newOverallState = 'NORMAL';

              return {
                ...zone,
                overallState: newOverallState,
                nodes: updatedNodesList
              };
            }
            return zone;
          });
        });
        
        // Update system status based on demo node state
        setSystemStatus(current => {
          return {
            ...current,
            overallRisk: updatedNode.state === 'CRITICAL' ? 95 : (updatedNode.state === 'WARNING' ? 75 : 12)
          };
        });
      } else if (msg.type === 'DEMO_RESET') {
        setNodes(mockNodes);
        setZones(mockZones);
        setSystemStatus(mockSystemStatus);
        setAlerts(mockAlerts);
        setTrendData(mockTrendData);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getNode = useCallback((id: string) => {
    return nodes.find(n => n.id === id);
  }, [nodes]);

  return {
    nodes,
    zones,
    systemStatus,
    alerts,
    recommendations,
    trendData,
    getNode
  };
}
