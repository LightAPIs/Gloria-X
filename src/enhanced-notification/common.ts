const TRANSPARENT_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';

function resolveUrl(url: string, base: string): string {
  return new URL(url, base).href;
}

async function textFetcher(url: string): Promise<string> {
  return await fetch(url).then(res => res.text());
}

async function bufferFetcher(url: string): Promise<ArrayBuffer> {
  return await fetch(url).then(res => res.arrayBuffer());
}

function loadImage(url: string): Promise<HTMLImageElement> {
  if (url.startsWith('//')) {
    return Promise.race([loadImage('https:' + url), loadImage('http:' + url)]);
  } else {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', reject);
      img.src = url;
    });
  }
}

function create2DCanvas(
  width: number,
  height: number
): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return {
    canvas,
    ctx: canvas.getContext('2d') as CanvasRenderingContext2D,
  };
}

function imageToDataURI(img: HTMLImageElement): string {
  const { canvas, ctx } = create2DCanvas(img.width, img.height);
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL();
}

export { TRANSPARENT_IMAGE, resolveUrl, textFetcher, bufferFetcher, loadImage, imageToDataURI, create2DCanvas };
