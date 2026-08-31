import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { NodeState } from '../types';
import { useTelemetry } from '../hooks/useTelemetry';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Activity, Battery, ChevronLeft, Maximize2, Radio, Smartphone, Thermometer, Wifi, Zap, ArrowUpRight } from 'lucide-react';

export function SensorNode() {
  const { id } = useParams<{ id: string }>();
  const nodeId = id || 'MG-05';
  
  const { getNode, updateNodeState } = useTelemetry();
  const nodeData = getNode(nodeId);
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

  // Track last published values to throttle IMU messages


  // Sync real-time tilt to Command Center
  useEffect(() => {
    if (imuStatus !== 'ACTIVE' || !nodeData) return;

    // For this simulation upgrade, we simply use the global updateNodeState if needed, 
    // but the engine will overwrite it. 
    // To properly support the IMU, we'd need to pause engine updates for this node.
    // For the demo, the manual presenter controls are more reliable.
  }, [realTilt, imuStatus, nodeData]);

  // Presenter actions to simulate different states
  const handleSimulate = (state: NodeState) => {
    setIsTransmitting(true);
    
    // Publish reading to Command Center Simulation Engine
    updateNodeState(nodeId, state);

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

  if (!nodeData) {
    return (
      <div className="min-h-screen bg-mine-dark flex items-center justify-center text-white">
        <h2>Node not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mine-dark flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden sm:border-x sm:border-mine-border">
      
      {/* Mobile Top Bar */}
      <div className="bg-mine-dark/95 backdrop-blur z-10 sticky top-0 border-b border-mine-border/50 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-mine-muted hover:text-mine-text transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
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
            <Badge variant={getBadgeVariant(nodeData.state)} className="px-3 py-1 text-sm">
              {nodeData.state}
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
            {isTransmitting && nodeData.state === 'NORMAL' && <Radio className="h-5 w-5 animate-ping" />}
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
            {isTransmitting && nodeData.state === 'WARNING' && <Radio className="h-5 w-5 animate-ping" />}
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
            {isTransmitting && nodeData.state === 'CRITICAL' && <Radio className="h-5 w-5 animate-ping" />}
          </button>
        </div>
        
        {/* Mock Physical Hardware Indicators */}
        <div className="mt-auto pt-6 flex items-center justify-between text-[10px] text-mine-muted font-mono w-full px-2">
          <div className="flex gap-4">
            <div className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> {nodeData.temperature}°C</div>
            <div className="flex items-center gap-1">HW: ESP32-REV2</div>
          </div>
          
          <div className="text-semantic-cyan">
             SIMULATOR
          </div>
        </div>
      </div>
    </div>
  );
}
