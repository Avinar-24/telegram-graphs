const INIT_H_STEP = 0;
const FIRST_POINT_INDEX = 0;
const FIRST_STEP = 1;
const MINIMAP_HEIGHT = 100;

export const Minimap = {
  create(dataset, minimapWidth) {
    const canvas = document.createElement('canvas');

    canvas.width = minimapWidth;
    canvas.height = MINIMAP_HEIGHT; // TODO: Make it adjustable

    this.drawLines(canvas, dataset);

    return canvas;
  },

  drawLines(canvas, dataset) {
    const ctx = canvas.getContext('2d');
    const maxYValue = Math.max(...dataset.lines.reduce((acc, { points }) => acc.concat(points), []));
    const vStep = canvas.height / maxYValue;
    const hStep = canvas.width / (dataset.timestamps.length - FIRST_STEP);

    dataset.lines.forEach(({ points, color }) => {
      ctx.beginPath();
      ctx.moveTo(INIT_H_STEP, canvas.height - points[FIRST_POINT_INDEX] * vStep);

      for (let i = FIRST_STEP, length = points.length; i < length; i++) {
        ctx.lineTo(hStep * i, canvas.height - points[i] * vStep);
      }

      ctx.strokeStyle = color;
      ctx.stroke();
    });
  },

  resize(minimap, minimapWidth) {
    const canvas = minimap;
    const ctx = canvas.getContext('2d');
    /**
     * Make an in-memory canvas
     */
    const inMemoryCanvas = document.createElement('canvas');
    const inMemoryCtx = inMemoryCanvas.getContext('2d');

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
  },
};
