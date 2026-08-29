import { useState, useEffect, useCallback, useRef } from 'react';
import type { NodeState, SensorNode as SensorNodeType } from '../types';
import { mockNodes } from '../data/mockData';
import { commService } from '../services/CommunicationService';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Activity, Battery, ChevronLeft, Maximize2, Radio, Smartphone, Thermometer, Wifi, Zap, ArrowUpRight } from 'lucide-react';

export function SensorNode() {
  // Start with MG-05 as the target node for the demo
  const [nodeData, setNodeData] = useState<SensorNodeType>(mockNodes.find(n => n.id === 'MG-05') || mockNodes[0]);
  const [simulatedState, setSimulatedState] = useState<NodeState>(nodeData.state);
  const [isTransmitting, setIsTransmitting] = useState(false);

  // IMU State
  const [imuStatus, setImuStatus] = useState<'IDLE' | 'ACTIVE' | 'UNAVAILABLE'>('IDLE');
  const [realTilt, setRealTilt] = useState<number>(0);
  const lastUpdateTime = useRef(0);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const now = Date.now();
    if (now - lastUpdateTime.current < 100) return; // Throttle to 10fps for UI stability
    
    // beta is front-to-back tilt in degrees (-180 to 180)
    if (event.beta !== null) {
      lastUpdateTime.current = now;
      const tilt = Math.round(Math.abs(event.beta) * 10) / 10;
      setRealTilt(tilt);
    }
  }, []);

  const requestImuPermission = () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            setImuStatus('ACTIVE');
          } else {
            setImuStatus('UNAVAILABLE');
          }
        })
        .catch(console.error);
    } else {
      if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleOrientation);
        setImuStatus('ACTIVE');
      } else {
        setImuStatus('UNAVAILABLE');
      }
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleOrientation]);

  // Track last published values to throttle MQTT messages
  const lastPublishedTilt = useRef(0);
  const lastPublishTime = useRef(0);

  // Sync real-time tilt to Command Center
  useEffect(() => {
    if (imuStatus !== 'ACTIVE') return;

    const now = Date.now();
    const timeSinceLastPublish = now - lastPublishTime.current;
    const tiltDiff = Math.abs(realTilt - lastPublishedTilt.current);

    // Throttle to 2 updates per second (500ms), and require at least 0.2° change
    if (timeSinceLastPublish > 500 && tiltDiff >= 0.2) {
      lastPublishTime.current = now;
      lastPublishedTilt.current = realTilt;

      setNodeData(current => {
        const updatedNode = {
          ...current,
          tilt: realTilt,
          lastUpdated: new Date().toISOString()
        };
        // Publish live tilt reading to Command Center
        commService.publishReading(updatedNode);
        return updatedNode;
      });
    }
  }, [realTilt, imuStatus]);

  // Presenter actions to simulate different states
  const handleSimulate = (state: NodeState) => {
    setSimulatedState(state);
    setIsTransmitting(true);
    
    // Generate appropriate demo data for the requested state
    let newTilt = nodeData.tilt;
    let newDisp = nodeData.displacement;
    let newStrain = nodeData.strain;
    let newVib = nodeData.vibration;
    
    if (state === 'NORMAL') {
      newTilt = imuStatus === 'ACTIVE' ? realTilt : 1.0 + Math.random() * 0.5;
      newDisp = 0.0 + Math.random() * 0.2;
      newStrain = 100 + Math.random() * 30;
      newVib = 0.3 + Math.random() * 0.3;
    } else if (state === 'WARNING') {
      newTilt = imuStatus === 'ACTIVE' ? realTilt : 4.0 + Math.random() * 1.5;
      newDisp = 2.0 + Math.random() * 1.0;
      newStrain = 400 + Math.random() * 150;
      newVib = 2.5 + Math.random() * 1.5;
    } else if (state === 'CRITICAL') {
      newTilt = imuStatus === 'ACTIVE' ? realTilt : 8.0 + Math.random() * 3.0;
      newDisp = 5.0 + Math.random() * 2.0;
      newStrain = 800 + Math.random() * 200;
      newVib = 7.0 + Math.random() * 3.0;
    }

    const updatedNode: SensorNodeType = {
      ...nodeData,
      state: state,
      tilt: newTilt,
      displacement: newDisp,
      strain: Math.round(newStrain),
      vibration: newVib,
      lastUpdated: new Date().toISOString()
    };

    setNodeData(updatedNode);
    
    // Publish reading to Command Center
    commService.publishReading(updatedNode);

    setTimeout(() => {
      setIsTransmitting(false);
    }, 800);
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

  return (
    <div className="min-h-screen bg-mine-dark flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden sm:border-x sm:border-mine-border">
      
      {/* Mobile Top Bar */}
      <div className="bg-mine-dark/95 backdrop-blur z-10 sticky top-0 border-b border-mine-border/50 px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-mine-muted hover:text-mine-text transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </a>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-bold tracking-widest text-mine-text">SENSOR NODE</h1>
          <span className="text-[10px] text-mine-muted">SIMULATOR PROTOCOL</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className={isTransmitting ? "h-4 w-4 text-semantic-cyan animate-pulse" : "h-4 w-4 text-semantic-green"} />
          <Battery className="h-4 w-4 text-semantic-green" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 pb-12">
        
        {/* Device Identity */}
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 rounded-full bg-mine-panel border border-mine-border flex items-center justify-center mb-3">
            <Smartphone className="h-8 w-8 text-semantic-cyan" />
          </div>
          <h2 className="text-2xl font-bold font-mono text-mine-text">{nodeData.id}</h2>
          <p className="text-sm text-mine-muted">{nodeData.zone}</p>
          <div className="mt-2">
            <Badge variant={getBadgeVariant(simulatedState)} className="px-3 py-1 text-sm">
              {simulatedState}
            </Badge>
          </div>
        </div>

        {/* Live Device Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-mine-muted flex items-center gap-2">
              <Radio className="h-3 w-3" /> Live Device Input
            </h3>
            {imuStatus === 'ACTIVE' ? (
              <span className="text-[10px] uppercase font-bold text-semantic-cyan flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-semantic-cyan animate-pulse"></span> IMU ACTIVE
              </span>
            ) : imuStatus === 'UNAVAILABLE' ? (
              <span className="text-[10px] uppercase font-bold text-semantic-red flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full border border-semantic-red"></span> IMU UNAVAILABLE
              </span>
            ) : (
              <button onClick={requestImuPermission} className="text-[10px] uppercase font-bold bg-semantic-cyan/20 text-semantic-cyan px-2 py-1 rounded border border-semantic-cyan/50 hover:bg-semantic-cyan/30 transition-colors">
                ENABLE MOTION SENSOR
              </button>
            )}
          </div>
          
          <Card className="bg-mine-panel border-semantic-cyan/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <CardContent className="p-4 flex flex-col gap-1 items-center justify-center">
              <span className="text-xs text-mine-muted flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Tilt</span>
              <span className="text-3xl font-mono font-bold text-semantic-cyan">
                {imuStatus === 'ACTIVE' ? realTilt.toFixed(1) : nodeData.tilt.toFixed(1)}°
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Simulated Channels */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-mine-muted flex items-center gap-2">
            <Activity className="h-3 w-3" /> Simulated Channels
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-mine-panel/50">
              <CardContent className="p-3 flex flex-col gap-1">
                <span className="text-[10px] text-mine-muted flex items-center gap-1"><Maximize2 className="h-3 w-3" /> Disp</span>
                <span className="text-sm font-mono font-bold text-mine-text">{nodeData.displacement.toFixed(2)}</span>
              </CardContent>
            </Card>

            <Card className="bg-mine-panel/50">
              <CardContent className="p-3 flex flex-col gap-1">
                <span className="text-[10px] text-mine-muted flex items-center gap-1"><Activity className="h-3 w-3" /> Strain</span>
                <span className="text-sm font-mono font-bold text-mine-text">{nodeData.strain}</span>
              </CardContent>
            </Card>

            <Card className="bg-mine-panel/50">
              <CardContent className="p-3 flex flex-col gap-1">
                <span className="text-[10px] text-mine-muted flex items-center gap-1"><Zap className="h-3 w-3" /> Vib</span>
                <span className="text-sm font-mono font-bold text-mine-text">{nodeData.vibration.toFixed(2)}</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Presenter Controls */}
        <div className="mt-4 pt-6 border-t border-mine-border/50 space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-mine-muted">Presenter Controls</h3>
            <p className="text-[10px] text-mine-muted mt-1">Simulate data transmission to Command Center</p>
          </div>

          <button 
            onClick={() => handleSimulate('NORMAL')}
            disabled={isTransmitting}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-semantic-green/30 bg-semantic-green/10 hover:bg-semantic-green/20 active:scale-[0.98] transition-all text-semantic-green"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-semantic-green shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="font-bold tracking-wide">SEND NORMAL READING</span>
            </div>
            {isTransmitting && simulatedState === 'NORMAL' && <Radio className="h-5 w-5 animate-ping" />}
          </button>

          <button 
            onClick={() => handleSimulate('WARNING')}
            disabled={isTransmitting}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-semantic-amber/30 bg-semantic-amber/10 hover:bg-semantic-amber/20 active:scale-[0.98] transition-all text-semantic-amber"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-semantic-amber shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <span className="font-bold tracking-wide">SEND WARNING READING</span>
            </div>
            {isTransmitting && simulatedState === 'WARNING' && <Radio className="h-5 w-5 animate-ping" />}
          </button>

          <button 
            onClick={() => handleSimulate('CRITICAL')}
            disabled={isTransmitting}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-semantic-red/30 bg-semantic-red/10 hover:bg-semantic-red/20 active:scale-[0.98] transition-all text-semantic-red"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-semantic-red shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="font-bold tracking-wide">SEND CRITICAL READING</span>
            </div>
            {isTransmitting && simulatedState === 'CRITICAL' && <Radio className="h-5 w-5 animate-ping" />}
          </button>
        </div>
        
        {/* Mock Physical Hardware Indicators */}
        <div className="mt-auto pt-6 flex items-center justify-between text-[10px] text-mine-muted font-mono w-full px-2">
          <div className="flex gap-4">
            <div className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> {nodeData.temperature}°C</div>
            <div className="flex items-center gap-1">HW: ESP32-REV2</div>
          </div>
          
          {/* Unobtrusive reset for SIH Demo */}
          <button 
            onClick={() => {
              commService.resetDemo();
              // Reset local mock state as well
              const defaultNode = mockNodes.find(n => n.id === 'MG-05') || mockNodes[0];
              setNodeData(defaultNode);
              setSimulatedState(defaultNode.state);
            }}
            className="px-2 py-1 border border-mine-border rounded hover:bg-mine-border/30 transition-colors"
          >
            DEMO RESET
          </button>
        </div>
      </div>
    </div>
  );
}
