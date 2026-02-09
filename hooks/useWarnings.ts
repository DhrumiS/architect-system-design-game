import { useMemo } from 'react';
import { useArchitectureStore } from '@/store/useArchitectureStore';
import { detectAntiPatterns } from '@/lib/anti-patterns';
import { SCENARIOS } from '@/constants';
import { Warning } from '@/models';

/**
 * Hook to detect anti-patterns in the current architecture
 * Recalculates whenever architecture or scenario changes
 */
export function useWarnings(): Warning[] {
  const architecture = useArchitectureStore((state) => state.architecture);
  const currentScenario = useArchitectureStore((state) => state.currentScenario);
  
  const warnings = useMemo(() => {
    if (!architecture || !currentScenario) {
      return [];
    }
    
    const scenario = SCENARIOS[currentScenario];
    return detectAntiPatterns(architecture, scenario);
  }, [architecture, currentScenario]);
  
  return warnings;
}
