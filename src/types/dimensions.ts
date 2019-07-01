export type ChartWidth = number;

interface Body {
  width: number;
}

interface Html {
  height: number;
}

interface Window {
  height: number;
}

export interface Dimensions {
  body: Body;
  html: Html;
  window: Window;
  chartWidth: ChartWidth;
}
