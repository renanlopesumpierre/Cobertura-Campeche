export interface Zone {
  id: string;
  name: string;
  description: string;
  area?: string; // e.g., "Approx 12m²"
  coordinates?: string; // Optional SVG path/points override if needed
  color: string;
}

export type ViewMode = 'technical' | 'visual';

export interface DimensionLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  offset?: number;
  vertical?: boolean;
}

export type FurnitureType = 'table4' | 'umbrella' | 'lights' | 'plant' | 'lounger' | 'sofa' | 'chair' | 'coffeeTable' | 'hammock' | 'stringLights';

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  visible: boolean;
}