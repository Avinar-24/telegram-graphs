/**
 * @example
 * "x", "y0", "y1"
 */
export type Label = string;

/**
 * @type {Array.<Label, ...number[]>}
 * @example
 * ["x", 1542412800000, 1542499200000, ...]
 * ["y0", 37, 20, 32, 9, 32, 35, 1, 2, ...]
 * ["y1", 12, 31, 22, 1, 12, 33, 1, 4, ...]
 */
export type Column = readonly [Label, ...number[]];

/**
 * @type {Object.<Label, string>}
 * @example
 * {
 *   "y0": "#3DC23F",
 *   "y1": "#F34C44"
 * }
 */
export type Colors = { readonly [propName: string]: string };

/**
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
 * Vertical columns are defined as "line".
 * Horizontal column is defined as "x".
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