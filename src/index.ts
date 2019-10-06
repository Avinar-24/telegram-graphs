import { Builder } from './builder/builder';
import { ChartData } from './types/data';

window.addEventListener('load', () => {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', e => {
    const target = e.target as XMLHttpRequest;
    const chartsData: ChartData[] = JSON.parse(target.responseText);

    Builder.run(chartsData);
  });

  xhr.open('GET', 'data.json');
  xhr.send();
});
