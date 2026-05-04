import type { ResultStats } from "../types";
import { formatTime } from "./time";

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1920;
const ART_SCALE = 1.2;
const ART_OFFSET_Y = 120;
const FONT_FAMILY =
  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

function pageLabel(pagesRead: number) {
  return pagesRead > 1 ? "PAGES" : "PAGE";
}

function drawBook(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = "#ff6d1a";
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(450, 1060);
  ctx.bezierCurveTo(395, 1015, 335, 1000, 280, 1026);
  ctx.lineTo(280, 1210);
  ctx.bezierCurveTo(335, 1184, 395, 1199, 450, 1244);
  ctx.bezierCurveTo(505, 1199, 565, 1184, 620, 1210);
  ctx.lineTo(620, 1026);
  ctx.bezierCurveTo(565, 1000, 505, 1015, 450, 1060);
  ctx.lineTo(450, 1244);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(325, 1070);
  ctx.bezierCurveTo(365, 1060, 405, 1075, 430, 1100);
  ctx.moveTo(325, 1128);
  ctx.bezierCurveTo(365, 1118, 405, 1132, 430, 1156);
  ctx.moveTo(575, 1070);
  ctx.bezierCurveTo(535, 1060, 495, 1075, 470, 1100);
  ctx.moveTo(575, 1128);
  ctx.bezierCurveTo(535, 1118, 495, 1132, 470, 1156);
  ctx.stroke();

  ctx.restore();
}

function setFont(ctx: CanvasRenderingContext2D, size: number) {
  ctx.font = `800 ${size}px ${FONT_FAMILY}`;
}

function drawOutlinedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  strokeWidth: number,
) {
  ctx.save();
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = "#fff";
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function createResultImageBlob(stats: ResultStats) {
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);

  ctx.save();
  ctx.translate(0, ART_OFFSET_Y);
  ctx.scale(ART_SCALE, ART_SCALE);

  ctx.textAlign = "center";
  setFont(ctx, 42);
  drawOutlinedText(ctx, pageLabel(stats.pagesRead), 450, 120, 8);
  setFont(ctx, 136);
  drawOutlinedText(ctx, String(stats.pagesRead), 450, 250, 12);
  setFont(ctx, 42);
  drawOutlinedText(ctx, "PACE", 450, 400, 8);
  setFont(ctx, 132);
  drawOutlinedText(ctx, formatTime(stats.pace), 425, 540, 12);
  setFont(ctx, 52);
  drawOutlinedText(ctx, "/p", 660, 540, 8);
  setFont(ctx, 42);
  drawOutlinedText(ctx, "TIME", 450, 690, 8);
  setFont(ctx, 136);
  drawOutlinedText(ctx, formatTime(stats.elapsed), 450, 850, 12);
  drawBook(ctx);
  ctx.restore();

  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
}
