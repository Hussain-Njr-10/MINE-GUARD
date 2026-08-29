import type { SensorNode } from '../types';
import mqtt from 'mqtt';

export type TelemetryMessage = {
  type: 'SENSOR_READING' | 'DEMO_RESET';
  payload?: any;
};

type MessageCallback = (msg: TelemetryMessage) => void;

class CommunicationService {
  private client: mqtt.MqttClient | null = null;
  private listeners: Set<MessageCallback> = new Set();
  private static instance: CommunicationService;
  
  // Use a unique topic string for the SIH demo to prevent collisions
  private topic = 'mineguards/sih2026/telemetry/demo1';

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
    if (typeof window === 'undefined') return;

    // Connect to HiveMQ public broker over WebSockets
    this.client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    this.client.on('connect', () => {
      console.log('Connected to public MQTT broker');
      this.client?.subscribe(this.topic, (err) => {
        if (!err) {
          console.log('Subscribed to telemetry topic:', this.topic);
        }
      });
    });

    this.client.on('message', (topic, message) => {
      if (topic === this.topic) {
        try {
          const parsedMsg = JSON.parse(message.toString()) as TelemetryMessage;
          this.notifyListeners(parsedMsg);
        } catch (e) {
          console.error("Failed to parse MQTT message", e);
        }
      }
    });
    
    this.client.on('error', (err) => {
      console.error('MQTT error: ', err);
    });
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
    
    if (this.client && this.client.connected) {
      this.client.publish(this.topic, JSON.stringify(message));
    } else {
      // Fallback for same-window testing if network fails
      this.notifyListeners(message); 
    }
  }
  
  public resetDemo() {
    const message: TelemetryMessage = { type: 'DEMO_RESET' };
    if (this.client && this.client.connected) {
      this.client.publish(this.topic, JSON.stringify(message));
    } else {
      this.notifyListeners(message);
    }
  }
  
  public cleanup() {
    if (this.client) {
      this.client.end();
    }
  }
}

export const commService = CommunicationService.getInstance();
