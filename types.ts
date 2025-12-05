export interface CalculationResult {
  speed: number;
  distance: number;
  time: number;
}

export interface ChartDataPoint {
  name: string | number;
  value: number;
  uv?: number; // Optional secondary metric
}
