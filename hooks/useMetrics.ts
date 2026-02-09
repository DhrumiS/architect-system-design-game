import { useMemo } from 'react';
import { useArchitectureStore } from '@/store/useArchitectureStore';
import { calculateMetrics } from '@/lib/scoring';
import { SCENARIOS } from '@/constants';
import { Metrics } from '@/models';

/**
 * Hook to calculate real-time metrics for the current architecture
 * Recalculates whenever architecture or scenario changes
 */
export function useMetrics(): Metrics | null {
  const architecture = useArchitectureStore((state) => state.architecture);
  const currentScenario = useArchitectureStore((state) => state.currentScenario);
  
  const metrics = useMemo(() => {
    if (!architecture || !currentScenario) {
      return null;
    }
    
    const scenario = SCENARIOS[currentScenario];
    return calculateMetrics(architecture, scenario);
  }, [architecture, currentScenario]);
  
  return metrics;
}
