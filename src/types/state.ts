export interface LegendItem {
  isActive: boolean;
}

interface Legend {
  [key: string]: LegendItem;
}

interface ChartState {
  legend: Legend;
}

export interface State {
  [key: string]: ChartState;
}
