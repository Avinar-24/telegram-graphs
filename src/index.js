import { Builder } from './builder';

window.addEventListener('load', () => {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', e => {
    const chartData = JSON.parse(e.target.responseText);

    Builder.run(chartData);
  });

  xhr.open('GET', 'data.json');
  xhr.send();
});
