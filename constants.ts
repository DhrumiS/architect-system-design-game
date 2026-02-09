import { Scenario, ScenarioType, ComponentType } from './models';

// Scenario configurations with requirements and metric weights
export const SCENARIOS: Record<ScenarioType, Scenario> = {
  chat: {
    id: 'chat',
    name: 'Real-Time Chat Application',
    description: 'Design a system for instant messaging with presence and notifications',
    requirements: [
      'Low latency (<100ms)',
      'High availability',
      'Real-time updates',
      'Message persistence'
    ],
    weights: {
      latency: 0.4,
      cost: 0.1,
      scalability: 0.3,
      reliability: 0.2
    }
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-Commerce Platform',
    description: 'Design a scalable online shopping system with inventory and payments',
    requirements: [
      'High reliability',
      'Transaction consistency',
      'Search performance',
      'Peak load handling'
    ],
    weights: {
      latency: 0.2,
      cost: 0.2,
      scalability: 0.3,
      reliability: 0.3
    }
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Design a system for processing and visualizing large datasets',
    requirements: [
      'High throughput',
      'Batch processing',
      'Data aggregation',
      'Query performance'
    ],
    weights: {
      latency: 0.1,
      cost: 0.3,
      scalability: 0.4,
      reliability: 0.2
    }
  }
};

// Component definitions with configuration options and descriptions
export const COMPONENT_DEFINITIONS: Record<ComponentType, {
  name: string;
  options: string[];
  descriptions: Record<string, string>;
}> = {
  frontend: {
    name: 'Frontend',
    options: ['spa', 'ssr', 'cdn'],
    descriptions: {
      spa: 'Single Page Application - Client-side rendering',
      ssr: 'Server-Side Rendering - Better SEO and initial load',
      cdn: 'Content Delivery Network - Global edge caching'
    }
  },
  backend: {
    name: 'Backend',
    options: ['monolith', 'microservices'],
    descriptions: {
      monolith: 'Monolithic Architecture - Simple deployment, shared resources',
      microservices: 'Microservices - Independent scaling, higher complexity'
    }
  },
  database: {
    name: 'Database',
    options: ['sql', 'nosql'],
    descriptions: {
      sql: 'SQL Database - ACID transactions, structured data',
      nosql: 'NoSQL Database - Flexible schema, horizontal scaling'
    }
  },
  cache: {
    name: 'Cache',
    options: ['redis', 'none'],
    descriptions: {
      redis: 'Redis Cache - In-memory data store for fast reads',
      none: 'No Cache - Direct database access'
    }
  },
  queue: {
    name: 'Message Queue',
    options: ['kafka', 'none'],
    descriptions: {
      kafka: 'Apache Kafka - Distributed event streaming',
      none: 'No Queue - Synchronous processing'
    }
  },
  auth: {
    name: 'Authentication',
    options: ['jwt', 'oauth'],
    descriptions: {
      jwt: 'JWT Tokens - Stateless authentication',
      oauth: 'OAuth 2.0 - Third-party authentication'
    }
  }
};

// Component type labels for UI display
export const COMPONENT_LABELS: Record<ComponentType, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  cache: 'Cache',
  queue: 'Queue',
  auth: 'Auth'
};

// Color scheme for components (for visual distinction)
export const COMPONENT_COLORS: Record<ComponentType, string> = {
  frontend: 'bg-blue-500/20 border-blue-500',
  backend: 'bg-green-500/20 border-green-500',
  database: 'bg-purple-500/20 border-purple-500',
  cache: 'bg-orange-500/20 border-orange-500',
  queue: 'bg-yellow-500/20 border-yellow-500',
  auth: 'bg-red-500/20 border-red-500'
};
