import { create } from 'zustand';
import { Architecture, ArchitectureComponent, Connection, ScenarioType } from '@/models';

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

export const useArchitectureStore = create<ArchitectureStore>((set) => ({
  // Initial state
  currentScenario: null,
  architecture: null,
  selectedComponentId: null,
  
  // Set the current scenario and initialize a new architecture
  setScenario: (scenario) => set({
    currentScenario: scenario,
    architecture: {
      id: crypto.randomUUID(),
      scenarioId: scenario,
      components: [],
      connections: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    selectedComponentId: null
  }),
  
  // Add a component to the architecture
  addComponent: (component) => set((state) => {
    if (!state.architecture) return state;
    
    return {
      architecture: {
        ...state.architecture,
        components: [...state.architecture.components, component],
        updatedAt: new Date()
      }
    };
  }),
  
  // Update a component's properties
  updateComponent: (id, updates) => set((state) => {
    if (!state.architecture) return state;
    
    return {
      architecture: {
        ...state.architecture,
        components: state.architecture.components.map(comp =>
          comp.id === id ? { ...comp, ...updates } : comp
        ),
        updatedAt: new Date()
      }
    };
  }),
  
  // Remove a component and its connections
  removeComponent: (id) => set((state) => {
    if (!state.architecture) return state;
    
    return {
      architecture: {
        ...state.architecture,
        components: state.architecture.components.filter(comp => comp.id !== id),
        connections: state.architecture.connections.filter(
          conn => conn.source !== id && conn.target !== id
        ),
        updatedAt: new Date()
      },
      selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId
    };
  }),
  
  // Add a connection between components
  addConnection: (connection) => set((state) => {
    if (!state.architecture) return state;
    
    return {
      architecture: {
        ...state.architecture,
        connections: [...state.architecture.connections, connection],
        updatedAt: new Date()
      }
    };
  }),
  
  // Remove a connection
  removeConnection: (id) => set((state) => {
    if (!state.architecture) return state;
    
    return {
      architecture: {
        ...state.architecture,
        connections: state.architecture.connections.filter(conn => conn.id !== id),
        updatedAt: new Date()
      }
    };
  }),
  
  // Select a component
  selectComponent: (id) => set({ selectedComponentId: id }),
  
  // Clear the current architecture
  clearArchitecture: () => set((state) => ({
    architecture: state.currentScenario ? {
      id: crypto.randomUUID(),
      scenarioId: state.currentScenario,
      components: [],
      connections: [],
      createdAt: new Date(),
      updatedAt: new Date()
    } : null,
    selectedComponentId: null
  })),
  
  // Load an existing architecture
  loadArchitecture: (architecture) => set({
    architecture: {
      ...architecture,
      createdAt: new Date(architecture.createdAt),
      updatedAt: new Date(architecture.updatedAt)
    },
    currentScenario: architecture.scenarioId,
    selectedComponentId: null
  })
}));
