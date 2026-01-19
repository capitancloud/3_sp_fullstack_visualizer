export type ComponentType = 'browser' | 'frontend' | 'backend' | 'database' | 'external';

export interface ArchitectureComponent {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  icon: string;
  position: { x: number; y: number };
}

export interface SimulationStep {
  id: number;
  from: string;
  to: string;
  data: string;
  description: string;
  type: 'request' | 'response' | 'error';
}

export interface Simulation {
  id: string;
  name: string;
  description: string;
  category?: 'base' | 'crud' | 'errors' | 'payments' | 'files' | 'auth' | 'performance' | 'realtime';
  steps: SimulationStep[];
}

export type AnimationSpeed = 'slow' | 'normal' | 'fast';
