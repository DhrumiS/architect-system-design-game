// Core type definitions for the Architect System Design Game

export type ScenarioType = 'chat' | 'ecommerce' | 'analytics';

export type ComponentType = 'frontend' | 'backend' | 'database' | 'cache' | 'queue' | 'auth';

export interface ComponentConfig {
  frontend: 'spa' | 'ssr' | 'cdn';
  backend: 'monolith' | 'microservices';
  database: 'sql' | 'nosql';
  cache: 'redis' | 'none';
  queue: 'kafka' | 'none';
  auth: 'jwt' | 'oauth';
}

export interface ArchitectureComponent {
  id: string;
  type: ComponentType;
  config: ComponentConfig[ComponentType];
  position: { x: number; y: number };
}

export interface Connection {
  id: string;
  source: string;
  target: string;
}

export interface Architecture {
  id: string;
  scenarioId: ScenarioType;
  components: ArchitectureComponent[];
  connections: Connection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Metrics {
  latency: number;        // milliseconds
  cost: number;           // relative units (0-100)
  scalability: number;    // percentage (0-100)
  reliability: number;    // percentage (0-100)
  overallScore: number;   // weighted score (0-100)
}

export interface Warning {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  componentId?: string;
  antiPattern: string;
}

export interface Scenario {
  id: ScenarioType;
  name: string;
  description: string;
  requirements: string[];
  weights: {
    latency: number;
    cost: number;
    scalability: number;
    reliability: number;
  };
}

export interface Build {
  id: string;
  name: string;
  architecture: Architecture;
  metrics: Metrics;
  savedAt: Date;
}
