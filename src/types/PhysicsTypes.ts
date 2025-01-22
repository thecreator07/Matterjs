import Matter from "matter-js"
export interface EngineConfig {
    gravity?: {
      x: number;
      y: number;
      scale?: number;
    };
  }
  
  export interface RendererConfig {
    width?: number;
    height?: number;
    background?: string;
    wireframes?: boolean;
  }
  
  export interface ObjectConfig {
    x: number;
    y: number;
    options?: Matter.IBodyDefinition;
  }
  