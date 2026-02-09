import { Architecture, Metrics, Scenario, ComponentConfig } from '@/models';

// Base latency values for each component configuration (in milliseconds)
const BASE_LATENCY: Record<keyof ComponentConfig, Record<string, number>> = {
  frontend: { spa: 50, ssr: 100, cdn: 20 },
  backend: { monolith: 30, microservices: 50 },
  database: { sql: 40, nosql: 30 },
  cache: { redis: 5, none: 0 },
  queue: { kafka: 20, none: 0 },
  auth: { jwt: 10, oauth: 30 }
};

// Base cost values for each component configuration (relative units)
const BASE_COST: Record<keyof ComponentConfig, Record<string, number>> = {
  frontend: { spa: 5, ssr: 15, cdn: 25 },
  backend: { monolith: 20, microservices: 40 },
  database: { sql: 30, nosql: 25 },
  cache: { redis: 15, none: 0 },
  queue: { kafka: 20, none: 0 },
  auth: { jwt: 5, oauth: 10 }
};

// Latency added per connection hop (in milliseconds)
const HOP_LATENCY = 15;

/**
 * Calculate latency metric for an architecture
 * - Base latency per component type
 * - Additional latency per hop (connection)
 * - Cache reduces database latency by 20%
 */
function calculateLatency(architecture: Architecture): number {
  let totalLatency = 0;
  
  // Sum component latencies
  architecture.components.forEach(comp => {
    const latencyValue = BASE_LATENCY[comp.type][comp.config as string];
    totalLatency += latencyValue || 0;
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

/**
 * Calculate cost metric for an architecture
 * - Base cost per component
 * - Normalized to 0-100 scale
 */
function calculateCost(architecture: Architecture): number {
  let totalCost = 0;
  
  architecture.components.forEach(comp => {
    const costValue = BASE_COST[comp.type][comp.config as string];
    totalCost += costValue || 0;
  });
  
  // Normalize to 0-100 scale
  return Math.min(100, totalCost);
}

/**
 * Calculate scalability metric for an architecture
 * - Microservices score higher
 * - Cache improves scalability
 * - Queue enables async processing
 * - CDN improves global scalability
 */
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

/**
 * Calculate reliability metric for an architecture
 * - More components = more failure points
 * - OAuth more reliable than JWT
 * - SQL more reliable than NoSQL
 */
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

/**
 * Calculate overall score based on scenario weights
 * - Weighted average of all metrics
 * - Latency and cost are inverted (lower is better)
 */
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

/**
 * Main function to calculate all metrics for an architecture
 */
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
