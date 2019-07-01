import { Dimensions } from '../types/dimensions';

export const isVerticalScrollExist = (dimensions: Dimensions): boolean =>
  dimensions.html.height > dimensions.window.height;

export const getChartName = (index: number) => `chart_${index}`;
export const getItemName = (index: number) => `item_${index}`;