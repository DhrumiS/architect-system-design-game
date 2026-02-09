# Design Document

## Overview

Architect is a client-side System Design Strategy Game built with Next.js 14+ (App Router), TypeScript, and modern React libraries. The application provides an interactive canvas for designing software architectures with real-time metrics calculation, anti-pattern detection, and architecture comparison features. All logic runs client-side with localStorage for persistence, enabling static deployment.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
│                    (app/ directory)                          │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌──────▼──────┐
│  UI Components │   │  State Manager  │   │   Scoring   │
│   (shadcn/ui)  │   │    (Zustand)    │   │   Engine    │
│ Framer Motion  │   │                 │   │             │
└────────────────┘   └─────────────────┘   └─────────────┘
        │                     │                     │
        │            ┌────────▼────────┐            │
        │            │  React Flow     │            │
        └────────────►  (Canvas)       ◄────────────┘
                     └─────────────────┘
                              │
                     ┌────────▼────────┐
                     │   localStorage  │
                     │   (Persistence) │
                     └─────────────────┘
```

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with dark mode default
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Canvas**: React Flow
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Utilities**: date-fns

### Folder Structure

```
/
├── app/
│   ├── layout.tsx                    # Root layout with dark mode
│   ├── page.tsx                      # Landing/scenario selection
│   ├── scenarios/
│   │   └── [scenarioId]/
│   │       └── page.tsx              # Scenario builder page
│   ├── builder/
│   │   └── page.tsx                  # Main builder interface
│   └── compare/
│       └── page.tsx                  # Build comparison view
├── components/
│   ├── canvas/
│   │   ├── ArchitectureCanvas.tsx   # React Flow wrapper
│   │   ├── ComponentNode.tsx        # Custom node component
│   │   └── ConnectionEdge.tsx       # Custom edge component
│   ├── controls/
│   │   ├── ComponentPalette.tsx     # Drag source for components
│   │   ├── ConfigurationPanel.tsx   # Component config UI
│   │   └── ScenarioSelector.tsx     # Scenario picker
│   ├── metrics/
│   │   ├── MetricsDisplay.tsx       # Real-time metrics panel
│   │   ├── ScoreCard.tsx            # Overall score display
│   │   └── MetricsChart.tsx         # Recharts visualization
│   ├── warnings/
│   │   ├── WarningList.tsx          # Anti-pattern warnings
│   │   └── WarningBadge.tsx         # Individual warning
│   └── ui/
│       └── [shadcn components]      # Button, Card, Dialog, etc.
├── lib/
│   ├── scoring.ts                   # Metrics calculation engine
│   ├── anti-patterns.ts             # Anti-pattern detection
│   ├── storage.ts                   # localStorage utilities
│   └── utils.ts                     # General utilities
├── store/
│   ├── useArchitectureStore.ts      # Main Zustand store
│   ├── useBuildsStore.ts            # Saved builds store
│   └── useUIStore.ts                # UI state store
├── models.ts                         # TypeScript types/interfaces
├── constants.ts                      # Component configs, scenarios
└── hooks/
    ├── useMetrics.ts                # Metrics calculation hook
    ├── useWarnings.ts               # Anti-pattern detection hook
    └── useLocalStorage.ts           # localStorage hook
```

## Components and Interfaces

### Core Data Models

```typescript
// models.ts

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
```

### State Management (Zustand)

```typescript
// store/useArchitectureStore.ts

interface ArchitectureStore {
  // State
  currentScenario: ScenarioType | null;
  architecture: Architecture | null;
  selectedComponentId: string | null;
  
  // Actions
  setScenario: (scenario: ScenarioType) => void;
  addComponent: (component: ArchitectureComponent) => void;
  updateComponent: (id: string, updates: Partial<ArchitectureComponent>) => void;
  removeComponent: (id: string) => void;
  addConnection: (connection: Connection) => void;
  removeConnection: (id: string) => void;
  selectComponent: (id: string | null) => void;
  clearArchitecture: () => void;
  loadArchitecture: (architecture: Architecture) => void;
}

// store/useBuildsStore.ts

interface BuildsStore {
  builds: Build[];
  addBuild: (build: Build) => void;
  removeBuild: (id: string) => void;
  loadBuilds: () => void;
  saveBuilds: () => void;
}

// store/useUIStore.ts

interface UIStore {
  isPaletteOpen: boolean;
  isConfigPanelOpen: boolean;
  isCompareMode: boolean;
  selectedBuildsForComparison: string[];
  togglePalette: () => void;
  toggleConfigPanel: () => void;
  setCompareMode: (mode: boolean) => void;
  toggleBuildForComparison: (buildId: string) => void;
}
```

### Key Components

#### ArchitectureCanvas (React Flow)

```typescript
// components/canvas/ArchitectureCanvas.tsx

interface ArchitectureCanvasProps {
  components: ArchitectureComponent[];
  connections: Connection[];
  onComponentAdd: (component: ArchitectureComponent) => void;
  onComponentUpdate: (id: string, updates: Partial<ArchitectureComponent>) => void;
  onComponentRemove: (id: string) => void;
  onConnectionAdd: (connection: Connection) => void;
  onConnectionRemove: (id: string) => void;
  onComponentSelect: (id: string | null) => void;
}

// Features:
// - Custom node types for each component
// - Drag and drop from palette
// - Connection validation
// - Smooth animations with Framer Motion
// - Dark theme styling
```

#### MetricsDisplay

```typescript
// components/metrics/MetricsDisplay.tsx

interface MetricsDisplayProps {
  metrics: Metrics;
  scenario: Scenario;
}

// Features:
// - Real-time metric updates
// - Recharts visualization
// - Breakdown by metric type
// - Scenario-weighted scoring
// - Animated transitions
```

#### ConfigurationPanel

```typescript
// components/controls/ConfigurationPanel.tsx

interface ConfigurationPanelProps {
  component: ArchitectureComponent | null;
  onConfigUpdate: (config: any) => void;
}

// Features:
// - Dynamic options based on component type
// - Immediate updates
// - Tooltips for each option
// - shadcn/ui form components
```

## Scoring Engine

### Deterministic Formulas

```typescript
// lib/scoring.ts

export function calculateMetrics(
  architecture: Architecture,
  scenario: Scenario
): Metrics {
  const latency = calculateLatency(architecture);
  const cost = calculateCost(architecture);
  const scalability = calculateScalability(architecture);
  const reliability = calculateReliability(architecture);
  const overallScore = calculateOverallScore(
    { latency, cost, scalability, reliability },
    scenario.weights
  );
  
  return { latency, cost, scalability, reliability, overallScore };
}

// Latency Calculation
// - Base latency per component type
// - Additional latency per hop (connection)
// - Cache reduces database latency by 80%
// - CDN reduces frontend latency by 60%
function calculateLatency(architecture: Architecture): number {
  const BASE_LATENCY = {
    frontend: { spa: 50, ssr: 100, cdn: 20 },
    backend: { monolith: 30, microservices: 50 },
    database: { sql: 40, nosql: 30 },
    cache: { redis: 5, none: 0 },
    queue: { kafka: 20, none: 0 },
    auth: { jwt: 10, oauth: 30 }
  };
  
  const HOP_LATENCY = 15; // ms per connection
  
  let totalLatency = 0;
  
  // Sum component latencies
  architecture.components.forEach(comp => {
    totalLatency += BASE_LATENCY[comp.type][comp.config];
  });
  
  // Add hop latency
  totalLatency += architecture.connections.length * HOP_LATENCY;
  
  // Apply cache optimization
  const hasCache = architecture.components.some(
    c => c.type === 'cache' && c.config !== 'none'
  );
  const hasDatabase = architecture.components.some(c => c.type === 'database');
  
  if (hasCache && hasDatabase) {
    totalLatency *= 0.8; // 20% reduction
  }
  
  return Math.round(totalLatency);
}

// Cost Calculation
// - Base cost per component
// - Microservices add operational overhead
// - Cache and queue add infrastructure cost
function calculateCost(architecture: Architecture): number {
  const BASE_COST = {
    frontend: { spa: 5, ssr: 15, cdn: 25 },
    backend: { monolith: 20, microservices: 40 },
    database: { sql: 30, nosql: 25 },
    cache: { redis: 15, none: 0 },
    queue: { kafka: 20, none: 0 },
    auth: { jwt: 5, oauth: 10 }
  };
  
  let totalCost = 0;
  
  architecture.components.forEach(comp => {
    totalCost += BASE_COST[comp.type][comp.config];
  });
  
  // Normalize to 0-100 scale
  return Math.min(100, totalCost);
}

// Scalability Calculation
// - Microservices score higher
// - Cache improves scalability
// - Queue enables async processing
// - CDN improves global scalability
function calculateScalability(architecture: Architecture): number {
  let score = 50; // baseline
  
  const backend = architecture.components.find(c => c.type === 'backend');
  if (backend?.config === 'microservices') score += 20;
  
  const cache = architecture.components.find(c => c.type === 'cache');
  if (cache?.config === 'redis') score += 15;
  
  const queue = architecture.components.find(c => c.type === 'queue');
  if (queue?.config === 'kafka') score += 10;
  
  const frontend = architecture.components.find(c => c.type === 'frontend');
  if (frontend?.config === 'cdn') score += 5;
  
  return Math.min(100, score);
}

// Reliability Calculation
// - More components = more failure points
// - OAuth more reliable than JWT
// - SQL more reliable than NoSQL
// - Redundancy patterns increase reliability
function calculateReliability(architecture: Architecture): number {
  let score = 100;
  
  // Penalty for each component (failure points)
  score -= architecture.components.length * 3;
  
  const auth = architecture.components.find(c => c.type === 'auth');
  if (auth?.config === 'oauth') score += 5;
  
  const db = architecture.components.find(c => c.type === 'database');
  if (db?.config === 'sql') score += 5;
  
  return Math.max(0, Math.min(100, score));
}

// Overall Score
// - Weighted average based on scenario
function calculateOverallScore(
  metrics: Omit<Metrics, 'overallScore'>,
  weights: Scenario['weights']
): number {
  // Convert latency to 0-100 scale (lower is better)
  const latencyScore = Math.max(0, 100 - metrics.latency / 5);
  
  // Cost is already 0-100 (lower is better)
  const costScore = 100 - metrics.cost;
  
  // Scalability and reliability are already 0-100 (higher is better)
  
  const weightedScore =
    latencyScore * weights.latency +
    costScore * weights.cost +
    metrics.scalability * weights.scalability +
    metrics.reliability * weights.reliability;
  
  return Math.round(weightedScore);
}
```

### Anti-Pattern Detection

```typescript
// lib/anti-patterns.ts

export function detectAntiPatterns(
  architecture: Architecture,
  scenario: Scenario
): Warning[] {
  const warnings: Warning[] = [];
  
  // Missing cache for high-read scenarios
  if (scenario.id === 'chat' || scenario.id === 'ecommerce') {
    const hasCache = architecture.components.some(
      c => c.type === 'cache' && c.config !== 'none'
    );
    if (!hasCache) {
      warnings.push({
        id: 'no-cache',
        type: 'warning',
        message: 'Consider adding a cache layer for better read performance',
        antiPattern: 'missing-cache'
      });
    }
  }
  
  // Monolith for high-scale scenarios
  if (scenario.id === 'analytics') {
    const backend = architecture.components.find(c => c.type === 'backend');
    if (backend?.config === 'monolith') {
      warnings.push({
        id: 'monolith-scale',
        type: 'warning',
        message: 'Monolithic architecture may limit scalability for analytics workloads',
        componentId: backend.id,
        antiPattern: 'monolith-at-scale'
      });
    }
  }
  
  // Missing queue for async processing
  if (scenario.id === 'analytics' || scenario.id === 'ecommerce') {
    const hasQueue = architecture.components.some(
      c => c.type === 'queue' && c.config !== 'none'
    );
    if (!hasQueue) {
      warnings.push({
        id: 'no-queue',
        type: 'info',
        message: 'A message queue could improve async processing capabilities',
        antiPattern: 'missing-queue'
      });
    }
  }
  
  // Excessive latency
  const metrics = calculateMetrics(architecture, scenario);
  if (metrics.latency > 300) {
    warnings.push({
      id: 'high-latency',
      type: 'error',
      message: `High latency detected (${metrics.latency}ms). Consider optimizing component connections`,
      antiPattern: 'excessive-latency'
    });
  }
  
  // No database
  const hasDatabase = architecture.components.some(c => c.type === 'database');
  if (!hasDatabase && architecture.components.length > 2) {
    warnings.push({
      id: 'no-database',
      type: 'error',
      message: 'Most architectures require a database for data persistence',
      antiPattern: 'missing-database'
    });
  }
  
  return warnings;
}
```

## Data Models

### Scenarios Configuration

```typescript
// constants.ts

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

export const COMPONENT_DEFINITIONS = {
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
```

## Error Handling

### Client-Side Error Boundaries

```typescript
// app/error.tsx - Next.js error boundary

'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
```

### localStorage Error Handling

```typescript
// lib/storage.ts

export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
}

export function safeLocalStorageSet<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage: ${error}`);
    return false;
  }
}
```

### Validation

```typescript
// lib/validation.ts

export function validateArchitecture(architecture: Architecture): string[] {
  const errors: string[] = [];
  
  if (architecture.components.length === 0) {
    errors.push('Architecture must have at least one component');
  }
  
  // Validate connections reference existing components
  architecture.connections.forEach(conn => {
    const sourceExists = architecture.components.some(c => c.id === conn.source);
    const targetExists = architecture.components.some(c => c.id === conn.target);
    
    if (!sourceExists) {
      errors.push(`Connection source ${conn.source} does not exist`);
    }
    if (!targetExists) {
      errors.push(`Connection target ${conn.target} does not exist`);
    }
  });
  
  return errors;
}
```

## Testing Strategy

### Unit Tests

- **Scoring Engine**: Test all calculation functions with various architecture configurations
- **Anti-Pattern Detection**: Verify warnings are triggered correctly
- **Storage Utilities**: Test localStorage read/write with mocked storage
- **Validation**: Test architecture validation logic

### Component Tests

- **ArchitectureCanvas**: Test drag-and-drop, component selection, connection creation
- **ConfigurationPanel**: Test config updates for each component type
- **MetricsDisplay**: Test metric rendering and updates
- **WarningList**: Test warning display and dismissal

### Integration Tests

- **Full Flow**: Test complete user journey from scenario selection to build comparison
- **State Management**: Test Zustand store actions and state updates
- **Persistence**: Test saving and loading builds from localStorage

### E2E Tests (Optional)

- **Scenario Workflows**: Test complete architecture design for each scenario
- **Build Comparison**: Test saving multiple builds and comparing them

## Performance Considerations

### Optimization Strategies

1. **Memoization**: Use React.memo for expensive components
2. **Debouncing**: Debounce metrics calculation on rapid changes
3. **Lazy Loading**: Code-split routes with Next.js dynamic imports
4. **Virtual Rendering**: React Flow handles canvas virtualization
5. **Local Storage Throttling**: Batch localStorage writes

### Bundle Size

- Tree-shake unused shadcn/ui components
- Use dynamic imports for heavy libraries (Recharts)
- Optimize Framer Motion animations

## Accessibility

- Keyboard navigation for canvas and controls
- ARIA labels for all interactive elements
- Focus management for modals and panels
- High contrast dark theme
- Screen reader announcements for metric updates

## Deployment

- Static export via `next build && next export`
- Deploy to Vercel, Netlify, or GitHub Pages
- No environment variables required
- No backend dependencies
