import { FormattedData } from '../../types/formatted_data';
import { ChartWidth } from '../../types/dimensions';
import './minimap.css';

const INIT_H_STEP = 0;
const FIRST_POINT = 0;
const FIRST_STEP = 1;
const MINIMAP_HEIGHT = 100;

export class Minimap {
  static create(dataset: FormattedData, minimapWidth: ChartWidth): HTMLDivElement {
    const map = document.createElement('canvas');
    const controls = document.createElement('canvas');
    const minimap = this.assemble(map, controls);

    map.width = controls.width = minimapWidth;
    map.height = controls.height = MINIMAP_HEIGHT; // TODO: Make it adjustable

    this.drawLines(map, dataset);
    this.drawControls(controls);

    return minimap;
  }

  private static drawLines(map: HTMLCanvasElement, dataset: FormattedData): void {
    const ctx = map.getContext('2d') as CanvasRenderingContext2D;
    const showedLines = dataset.lines.filter(line => line.isShown);
    const maxYValue = Math.max(
      ...showedLines.reduce((acc, line) => acc.concat(line.points), [] as number[])
    );
    const vStep = map.height / maxYValue;
    const hStep = map.width / (dataset.timestamps.length - FIRST_STEP);

    showedLines.forEach(({ points, color }) => {
      ctx.beginPath();
      ctx.moveTo(INIT_H_STEP, map.height - points[FIRST_POINT] * vStep);

      for (let i = FIRST_STEP, length = points.length; i < length; i++) {
        ctx.lineTo(hStep * i, map.height - points[i] * vStep);
      }

      ctx.strokeStyle = color;
      ctx.stroke();
    });
  }

  private static drawControls(controls: HTMLCanvasElement): void {}

  static redraw(
    minimap: HTMLDivElement,
    dataset: FormattedData,
    lineState: boolean,
    lineIndex: number
  ): void {
    const map = minimap.children[0] as HTMLCanvasElement;
    const ctx = map.getContext('2d') as CanvasRenderingContext2D;

    dataset.lines[lineIndex].isShown = lineState;

    ctx.clearRect(0, 0, map.width, map.height);

    this.drawLines(map, dataset);
  }

  static resize(minimap: HTMLDivElement, minimapWidth: ChartWidth): void {
    const map = minimap.children[0] as HTMLCanvasElement;
    const ctx = map.getContext('2d') as CanvasRenderingContext2D;
    /**
     * Make an in-memory canvas
     */
    const inMemoryCanvas = document.createElement('canvas');
    const inMemoryCtx = inMemoryCanvas.getContext('2d') as CanvasRenderingContext2D;

    /**
     * Taking a snapshot before the canvas width is changed
     */
    inMemoryCanvas.width = map.width;
    inMemoryCanvas.height = map.height;
    inMemoryCtx.drawImage(map, 0, 0);

    map.width = minimapWidth;

    /**
     * Draw the snapshot on the new width with saved ratio
     */
    ctx.drawImage(inMemoryCanvas, 0, 0, map.width, map.height);
  }

  private static assemble(map: HTMLCanvasElement, controls: HTMLCanvasElement): HTMLDivElement {
    const minimap = document.createElement('div');

    minimap.className = 'minimap';
    map.className = 'minimap__map';
    controls.className = 'minimap__controls';

    minimap.appendChild(map);
    minimap.appendChild(controls);

    return minimap;
  }
}
