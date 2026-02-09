import { create } from 'zustand';

interface UIStore {
  isPaletteOpen: boolean;
  isConfigPanelOpen: boolean;
  isCompareMode: boolean;
  selectedBuildsForComparison: string[];
  
  togglePalette: () => void;
  toggleConfigPanel: () => void;
  setCompareMode: (mode: boolean) => void;
  toggleBuildForComparison: (buildId: string) => void;
  clearComparisonSelection: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  isPaletteOpen: true,
  isConfigPanelOpen: false,
  isCompareMode: false,
  selectedBuildsForComparison: [],
  
  // Toggle component palette visibility
  togglePalette: () => set((state) => ({
    isPaletteOpen: !state.isPaletteOpen
  })),
  
  // Toggle configuration panel visibility
  toggleConfigPanel: () => set((state) => ({
    isConfigPanelOpen: !state.isConfigPanelOpen
  })),
  
  // Set compare mode
  setCompareMode: (mode) => set({
    isCompareMode: mode,
    selectedBuildsForComparison: mode ? [] : []
  }),
  
  // Toggle a build for comparison (max 3 builds)
  toggleBuildForComparison: (buildId) => set((state) => {
    const isSelected = state.selectedBuildsForComparison.includes(buildId);
    
    if (isSelected) {
      // Remove from selection
      return {
        selectedBuildsForComparison: state.selectedBuildsForComparison.filter(
          id => id !== buildId
        )
      };
    } else {
      // Add to selection (max 3)
      if (state.selectedBuildsForComparison.length >= 3) {
        return state; // Don't add if already at max
      }
      return {
        selectedBuildsForComparison: [...state.selectedBuildsForComparison, buildId]
      };
    }
  }),
  
  // Clear comparison selection
  clearComparisonSelection: () => set({
    selectedBuildsForComparison: []
  })
}));
