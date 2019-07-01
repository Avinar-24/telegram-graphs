/**
 * @example
 * "x", "y0", "y1"
 */
export type Label = string;

/**
 * @description
 * There is a type of a vertical or horizontal column where the first element is its label.
 * @example
 * ["x", 1542412800000, 1542499200000, ...]
 * ["y0", 37, 20, 32, 9, 32, 35, 1, 2, ...]
 * ["y1", 12, 31, 22, 1, 12, 33, 1, 4, ...]
 */
export type Column = readonly [Label, ...number[]];

/**
 * @description
 * There is a type of column colors where keys are vertical column labels and values are their colors.
 * @type {Object.<Label, string>}
 * @example
 * {
 *   "y0": "#3DC23F",
 *   "y1": "#F34C44"
 * }
 */
export type Colors = { readonly [propName: string]: string };

/**
 * @description
 * There is a type of column names where keys are vertical column labels and values are their names.
 * @type {Object.<Label, string>}
 * @example
 * {
 *   "y0": "USD",
 *   "y1": "BTC"
 * }
 */
export type Names = { readonly [propName: string]: string };

/**
 * @description
 * There are column types where vertical columns are defined as "line" and the horizontal one as "x".
 * @type {Object.<Label, string>}
 * @example
 * {
 *   "x": "x",
 *   "y0": "line",
 *   "y1": "line"
 * }
 */
export type Types = { readonly [propName: string]: 'x' | 'line' };

export interface ChartData {
  colors: Colors;
  columns: Column[];
  names: Names;
  types: Types;
}