import { Minimap } from './minimap';
import { isVerticalScrollExist } from './utils';

export const Builder = {
  body: document.body,
  html: document.documentElement,
  dimensions: {
    body: {},
    html: {},
    window: {},
  },
  minimapGroup: [],

  defineDimensions() {
    const self = this;
    let bodyWidth = this.body.clientWidth;
    let htmlHeight = this.html.offsetHeight;
    let windowHeight = window.innerHeight;

    Object.defineProperty(this.dimensions.body, 'width', {
      get() {
        return bodyWidth;
      },
      set(newBodyWidth) {
        bodyWidth = newBodyWidth;
        // TODO: Init resize
        console.log('bodyWidth is changed');
      },
    });

    Object.defineProperty(this.dimensions.html, 'height', {
      get() {
        return htmlHeight;
      },
      set(newHtmlHeight) {
        htmlHeight = newHtmlHeight;
        self.update(self.dimensions, self.body, self.minimapGroup);
        console.log('htmlHeight is changed');
      },
    });

    Object.defineProperty(this.dimensions.window, 'height', {
      get() {
        return windowHeight;
      },
      set(newWindowHeight) {
        windowHeight = newWindowHeight;
        // TODO: Init resize
        console.log('windowHeight is changed');
      },
    });

    Object.defineProperty(this.dimensions, 'chartWidth', {
      get() {
        return this.body.width;
      },
    });
  },

  formatData({ columns, types, names, colors }) {
    const dataset = columns.reduce(
      (acc, column) => {
        const label = column[0];

        switch (types[label]) {
          case 'x':
            acc.timestamps = column.slice(1);
            return acc;
          case 'line':
            acc.lines.push({ points: column.slice(1), color: colors[label], name: names[label] });
            return acc;
          default:
            return acc;
        }
      },
      { lines: [] }
    );

    return dataset;
  },

  run(chartData) {
    const fragment = document.createDocumentFragment();

    this.defineDimensions();

    chartData.forEach(data => {
      const dataset = this.formatData(data);
      const minimap = Minimap.create(dataset, this.dimensions.chartWidth);

      this.minimapGroup.push(minimap);

      fragment.appendChild(minimap);
    });

    this.body.appendChild(fragment);

    /**
     * Update the html height after charts injection
     */
    this.dimensions.html.height = this.html.offsetHeight;
  },

  update(dimensions, body, minimapGroup) {
    if (isVerticalScrollExist(dimensions)) {
      /**
       * The body width is changed
       */
      dimensions.body.width = body.clientWidth;

      minimapGroup.forEach(minimap => Minimap.resize(minimap, dimensions.chartWidth));
    }
  },
};
