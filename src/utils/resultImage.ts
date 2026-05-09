import type { ResultStats } from "../types";

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1920;
const ART_SCALE = 1.2;
const ART_OFFSET_Y = 40;
const BOOK_Y = 950;
const PACE_SUFFIX_GAP = 0;
const SECTION_TITLE_FONT_SIZE = 42;
const PAGE_VALUE_FONT_SIZE = 124;
const PACE_VALUE_FONT_SIZE = 116;
const TIME_VALUE_FONT_SIZE = 124;
const PAGE_TITLE_Y = 120;
const PAGE_VALUE_Y = 240;
const PACE_TITLE_Y = 345;
const PACE_VALUE_Y = 465;
const SPEED_LABEL_Y = 530;
const TIME_TITLE_Y = 645;
const TIME_VALUE_Y = 765;
const FONT_FAMILY =
  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

function pageLabel(pagesRead: number) {
  return pagesRead > 1 ? "PAGES" : "PAGE";
}

function exportTimeParts(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function drawBook(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(0, BOOK_Y);
  ctx.strokeStyle = "#ff6d1a";
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(450, 0);
  ctx.bezierCurveTo(395, -45, 335, -60, 280, -34);
  ctx.lineTo(280, 150);
  ctx.bezierCurveTo(335, 124, 395, 139, 450, 184);
  ctx.bezierCurveTo(505, 139, 565, 124, 620, 150);
  ctx.lineTo(620, -34);
  ctx.bezierCurveTo(565, -60, 505, -45, 450, 0);
  ctx.lineTo(450, 184);
  ctx.stroke();

  ctx.restore();
}

function setFont(ctx: CanvasRenderingContext2D, size: number) {
  ctx.font = `800 ${size}px ${FONT_FAMILY}`;
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  if (ctx.measureText(text).width <= maxWidth) return text;

  let fitted = text;
  while (fitted.length > 1 && ctx.measureText(`${fitted}...`).width > maxWidth)
    fitted = fitted.slice(0, -1);

  return `${fitted}...`;
}

function drawExportText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
) {
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawExportDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
}

function drawExportTime(
  ctx: CanvasRenderingContext2D,
  totalSeconds: number,
  x: number,
  y: number,
  fontSize: number,
) {
  const { minutes, seconds } = exportTimeParts(totalSeconds);
  const digitColumnWidth = ctx.measureText("00").width;
  const separatorWidth = fontSize * 0.2;
  const totalWidth = digitColumnWidth * 2 + separatorWidth;
  const left = x - totalWidth / 2;
  const separatorX = left + digitColumnWidth + separatorWidth / 2;
  const secondsX = left + digitColumnWidth + separatorWidth;
  const dotRadius = (fontSize * 0.11) / 2;
  const dotDistance = fontSize * 0.31;
  const metrics = ctx.measureText("00");
  const centerY =
    y +
    ((metrics.actualBoundingBoxDescent ?? 0) -
      metrics.actualBoundingBoxAscent) /
      2;
  const dotCenterY = centerY;

  ctx.save();
  ctx.textAlign = "right";
  drawExportText(ctx, minutes, left + digitColumnWidth, y);
  ctx.textAlign = "left";
  drawExportText(ctx, seconds, secondsX, y);
  drawExportDot(ctx, separatorX, dotCenterY - dotDistance / 2, dotRadius);
  drawExportDot(ctx, separatorX, dotCenterY + dotDistance / 2, dotRadius);
  ctx.restore();

  return secondsX + ctx.measureText(seconds).width;
}

export function createResultImageCanvas(stats: ResultStats) {
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.save();
  ctx.translate(0, ART_OFFSET_Y);
  ctx.scale(ART_SCALE, ART_SCALE);

  ctx.textAlign = "center";
  if (stats.bookTitle) {
    setFont(ctx, 38);
    drawExportText(ctx, fitText(ctx, stats.bookTitle, 660), 450, 40);
  }
  setFont(ctx, SECTION_TITLE_FONT_SIZE);
  drawExportText(ctx, pageLabel(stats.pagesRead), 450, PAGE_TITLE_Y);
  setFont(ctx, PAGE_VALUE_FONT_SIZE);
  drawExportText(ctx, String(stats.pagesRead), 450, PAGE_VALUE_Y);
  setFont(ctx, SECTION_TITLE_FONT_SIZE);
  drawExportText(ctx, "PACE", 450, PACE_TITLE_Y);
  setFont(ctx, PACE_VALUE_FONT_SIZE);
  const paceRightEdge = drawExportTime(
    ctx,
    stats.pace,
    450,
    PACE_VALUE_Y,
    PACE_VALUE_FONT_SIZE,
  );
  setFont(ctx, PACE_VALUE_FONT_SIZE);
  ctx.textAlign = "left";
  drawExportText(ctx, "/p", paceRightEdge + PACE_SUFFIX_GAP, PACE_VALUE_Y);
  ctx.textAlign = "center";
  setFont(ctx, 36);
  drawExportText(ctx, stats.speedLabel.toUpperCase(), 450, SPEED_LABEL_Y);
  setFont(ctx, SECTION_TITLE_FONT_SIZE);
  drawExportText(ctx, "TIME", 450, TIME_TITLE_Y);
  setFont(ctx, TIME_VALUE_FONT_SIZE);
  drawExportTime(ctx, stats.elapsed, 450, TIME_VALUE_Y, TIME_VALUE_FONT_SIZE);
  drawBook(ctx);
  ctx.restore();

  return canvas;
}

export function createResultImageBlob(stats: ResultStats) {
  const canvas = createResultImageCanvas(stats);
  if (!canvas) return Promise.resolve(null);

  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
}
