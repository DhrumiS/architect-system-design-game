import { Architecture } from '@/models';

/**
 * Validate an architecture for structural integrity
 * Returns an array of error messages (empty if valid)
 */
export function validateArchitecture(architecture: Architecture): string[] {
  const errors: string[] = [];
  
  // Check if architecture has at least one component
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
  
  // Validate component IDs are unique
  const componentIds = architecture.components.map(c => c.id);
  const uniqueIds = new Set(componentIds);
  if (componentIds.length !== uniqueIds.size) {
    errors.push('Component IDs must be unique');
  }
  
  // Validate connection IDs are unique
  const connectionIds = architecture.connections.map(c => c.id);
  const uniqueConnIds = new Set(connectionIds);
  if (connectionIds.length !== uniqueConnIds.size) {
    errors.push('Connection IDs must be unique');
  }
  
  // Validate component positions are valid numbers
  architecture.components.forEach(comp => {
    if (typeof comp.position.x !== 'number' || typeof comp.position.y !== 'number') {
      errors.push(`Component ${comp.id} has invalid position`);
    }
    if (isNaN(comp.position.x) || isNaN(comp.position.y)) {
      errors.push(`Component ${comp.id} has NaN position`);
    }
  });
  
  return errors;
}

/**
 * Check if an architecture is valid (no errors)
 */
export function isArchitectureValid(architecture: Architecture): boolean {
  return validateArchitecture(architecture).length === 0;
}
