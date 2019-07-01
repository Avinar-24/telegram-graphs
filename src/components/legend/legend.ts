import { FormattedData } from '../../types/formatted_data';
import './legend.css';

export const Legend = {
  create(dataset: FormattedData): HTMLDivElement {
    const { lines } = dataset;
    const legend = document.createElement('div');

    legend.className = 'legend';

    lines.reduce((acc: HTMLDivElement, { color, name }) => {
      const legendItem = document.createElement('button');
      const legendName = document.createTextNode(name);
      const legendCircle = document.createElement('span');

      legendItem.className = 'legend__item';
      legendCircle.className = 'legend__circle legend__checkmark';
      legendCircle.style.background = color;
      legendCircle.style.border = `2px solid ${color}`;

      legendItem.appendChild(legendCircle);
      legendItem.appendChild(legendName);

      acc.appendChild(legendItem);

      return acc;
    }, legend);

    return legend;
  },

  toggle(legendItem: HTMLDivElement): void {
    legendItem.children[0].classList.toggle('legend__circle_bg_none');
  }
};
