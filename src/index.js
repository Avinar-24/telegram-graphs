import { Chart } from './chart';

const xhr = new XMLHttpRequest();

xhr.addEventListener('load', e => {
  const data = JSON.parse(e.target.responseText);
  const fragment = document.createDocumentFragment();

  data.forEach(chartData => {
    const chart = Chart.build(chartData);

    fragment.appendChild(chart);
  });

  document.body.appendChild(fragment);
});
xhr.open('GET', 'data.json');
xhr.send();
