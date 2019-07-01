import { Legend } from '../components/legend/legend';
import { Minimap } from '../components/minimap/minimap';
import { ChartData, Types, Names, Colors, Column, Label } from '../types/data';
import { FormattedData } from '../types/formatted_data';
import { Dimensions } from '../types/dimensions';
import { State, LegendItem } from '../types/state';
import { isVerticalScrollExist, getChartName, getItemName } from '../utils/index';

export const Builder = {
  body: document.body as HTMLBodyElement,
  html: document.documentElement as HTMLHtmlElement,
  minimapGroup: [] as HTMLCanvasElement[],
  dimensions: {
    body: {},
    html: {},
    window: {},
    // chartWidth: NaN, // Direct set?
  } as Dimensions,
  state: {} as State,

  initDimensions(): void {
    const self = this;
    let bodyWidth = this.body.offsetWidth;
    let htmlHeight = this.html.offsetHeight;
    let windowHeight = window.innerHeight;

    Object.defineProperty(this.dimensions.body, 'width', {
      get() {
        return bodyWidth;
      },
      set(width) {
        bodyWidth = width; // TODO: Probably an error with closure
        // TODO: Init resize
        console.log('bodyWidth is changed');
      },
    });

    Object.defineProperty(this.dimensions.html, 'height', {
      get() {
        return htmlHeight;
      },
      set(height) {
        htmlHeight = height;
        self.update(self.dimensions, self.body, self.minimapGroup);
        console.log('htmlHeight is changed');
      },
    });

    Object.defineProperty(this.dimensions.window, 'height', {
      get() {
        return windowHeight;
      },
      set(height) {
        windowHeight = height;
        // TODO: Init resize
        console.log('windowHeight is changed');
      },
    });

    Object.defineProperty(this.dimensions, 'chartWidth', {
      get() {
        return this.body.width; // self?
      },
    });
  },

  formatData(data: ChartData): FormattedData {
    const {
      columns,
      types,
      names,
      colors,
    }: {
      columns: Column[];
      types: Types;
      names: Names;
      colors: Colors;
    } = data;

    const dataset = columns.reduce(
      (acc: FormattedData, column: Column) => {
        const label: Label = column[0];
        const values = column.slice(1) as number[];

        switch (types[label]) {
          case 'x':
            acc.timestamps = values;
            return acc;
          case 'line':
            acc.lines.push({
              points: values,
              color: colors[label],
              name: names[label],
              isShown: true,
            });
            return acc;
          default:
            return acc;
        }
      },
      { lines: [], timestamps: [] }
    );

    return dataset;
  },

  bindControls(
    legend: HTMLDivElement,
    minimap: HTMLCanvasElement,
    dataset: FormattedData,
    chartName: string
  ): void {
    const children = [].slice.call(legend.children);
    /**
     * Expand the state to assign legend items to it.
     */
    this.state[chartName] = { legend: {} };

    children.forEach((legendItem: HTMLDivElement, index: number) => {
      const itemName = getItemName(index);
      const itemState = (this.state[chartName].legend[itemName] = { isActive: true }) as LegendItem;
      legendItem.addEventListener('click', () => {
        itemState.isActive = !itemState.isActive;

        Legend.toggle(legendItem);

        Minimap.redraw(minimap, dataset, itemState.isActive, index);
      });
    });
  },

  run(chartData: ChartData[]): void {
    /**
     * Initialize screen dimensions before components are being created
     */
    this.initDimensions();

    const fragment = document.createDocumentFragment();

    chartData.forEach((data: ChartData, index) => {
      const dataset = this.formatData(data);
      const minimap = Minimap.create(dataset, this.dimensions.chartWidth);
      const legend = Legend.create(dataset);
      const chartName = getChartName(index);

      this.minimapGroup.push(minimap);

      this.bindControls(legend, minimap, dataset, chartName);

      fragment.appendChild(minimap);
      fragment.appendChild(legend);
    });

    this.body.appendChild(fragment);

    /**
     * Update the html height after charts injection
     */
    this.dimensions.html.height = this.html.offsetHeight;
  },

  update(dimensions: Dimensions, body: HTMLBodyElement, minimapGroup: HTMLCanvasElement[]): void {
    if (isVerticalScrollExist(dimensions)) {
      /**
       * The body width is changed
       */
      dimensions.body.width = body.clientWidth;

      minimapGroup.forEach(minimap => Minimap.resize(minimap, dimensions.chartWidth));
    }
  },
};
