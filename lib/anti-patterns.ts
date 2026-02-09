import { Architecture, Scenario, Warning } from '@/models';
import { calculateMetrics } from './scoring';

/**
 * Detect anti-patterns in an architecture based on scenario requirements
 * Returns an array of warnings for suboptimal architectural decisions
 */
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
