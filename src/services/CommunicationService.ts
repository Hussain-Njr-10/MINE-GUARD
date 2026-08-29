import type { SensorNode } from '../types';

export type TelemetryMessage = {
  type: 'SENSOR_READING' | 'DEMO_RESET';
  payload?: any;
};

type MessageCallback = (msg: TelemetryMessage) => void;

class CommunicationService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<MessageCallback> = new Set();
  private static instance: CommunicationService;

  private constructor() {
    this.init();
  }

  public static getInstance(): CommunicationService {
    if (!CommunicationService.instance) {
      CommunicationService.instance = new CommunicationService();
    }
    return CommunicationService.instance;
  }

  private init() {
    // Abstracted connection logic.
    // Future: Connect to MQTT / WebSocket here.
    // For local prototype cross-tab communication:
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      this.channel = new BroadcastChannel('mine-guards-telemetry');
      this.channel.onmessage = (event) => {
        this.notifyListeners(event.data);
      };
    } else {
      console.warn("BroadcastChannel not supported in this environment.");
    }
  }

  public subscribe(callback: MessageCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(message: TelemetryMessage) {
    this.listeners.forEach(callback => callback(message));
  }

  public publishReading(node: SensorNode) {
    const message: TelemetryMessage = {
      type: 'SENSOR_READING',
      payload: node,
    };
    
    // Abstracted publish logic.
    // Future: Send to MQTT / WebSocket here.
    if (this.channel) {
      this.channel.postMessage(message);
    } else {
      // Fallback for same-window testing if channel fails
      this.notifyListeners(message); 
    }
  }
  
  public resetDemo() {
    const message: TelemetryMessage = { type: 'DEMO_RESET' };
    if (this.channel) {
      this.channel.postMessage(message);
    } else {
      this.notifyListeners(message);
    }
  }
  
  public cleanup() {
    if (this.channel) {
      this.channel.close();
    }
  }
}

export const commService = CommunicationService.getInstance();
