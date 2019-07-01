export interface Line {
  color: string;
  isShown: boolean;
  name: string;
  points: number[];
}

export interface FormattedData {
  lines: Line[];
  timestamps: number[];
}