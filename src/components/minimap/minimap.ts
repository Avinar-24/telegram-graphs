import { FormattedData } from '../../types/formatted_data';
import { ChartWidth } from '../../types/dimensions';
import './minimap.css';

const INIT_H_STEP = 0;
const FIRST_POINT = 0;
const FIRST_STEP = 1;
const MINIMAP_HEIGHT = 100;

export class Minimap {
  static create(dataset: FormattedData, minimapWidth: ChartWidth): HTMLDivElement {
    const canvas = document.createElement('canvas');
    let minimap: HTMLDivElement;

    canvas.width = minimapWidth;
    canvas.height = MINIMAP_HEIGHT; // TODO: Make it adjustable

    this.draw(canvas, dataset);

    minimap = this.wrap(canvas);

    return minimap;
  }

  private static draw(canvas: HTMLCanvasElement, dataset: FormattedData): void {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const showedLines = dataset.lines.filter(line => line.isShown);
    const maxYValue = Math.max(
      ...showedLines.reduce((acc, line) => acc.concat(line.points), [] as number[])
    );
    const vStep = canvas.height / maxYValue;
    const hStep = canvas.width / (dataset.timestamps.length - FIRST_STEP);

    showedLines.forEach(({ points, color }) => {
      ctx.beginPath();
      ctx.moveTo(INIT_H_STEP, canvas.height - points[FIRST_POINT] * vStep);

      for (let i = FIRST_STEP, length = points.length; i < length; i++) {
        ctx.lineTo(hStep * i, canvas.height - points[i] * vStep);
      }

      ctx.strokeStyle = color;
      ctx.stroke();
    });
  }

  static redraw(
    minimap: HTMLDivElement,
    dataset: FormattedData,
    lineState: boolean,
    lineIndex: number
  ): void {
    const canvas = minimap.children[0] as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    dataset.lines[lineIndex].isShown = lineState;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.draw(canvas, dataset);
  }

  static resize(minimap: HTMLDivElement, minimapWidth: ChartWidth): void {
    const canvas = minimap.children[0] as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    /**
     * Make an in-memory canvas
     */
    const inMemoryCanvas = document.createElement('canvas');
    const inMemoryCtx = inMemoryCanvas.getContext('2d') as CanvasRenderingContext2D;

    /**
     * Taking a snapshot before the canvas width is changed
     */
    inMemoryCanvas.width = canvas.width;
    inMemoryCanvas.height = canvas.height;
    inMemoryCtx.drawImage(canvas, 0, 0);

    canvas.width = minimapWidth;

    /**
     * Draw the snapshot on the new width with saved ratio
     */
    ctx.drawImage(inMemoryCanvas, 0, 0, canvas.width, canvas.height);
  }

  private static wrap(canvas: HTMLCanvasElement): HTMLDivElement {
    const minimap = document.createElement('div');
    const window = document.createElement('div');

    minimap.className = 'minimap';
    window.className = 'minimap__window';

    minimap.append(canvas);
    minimap.append(window);

    return minimap;
  }
}
