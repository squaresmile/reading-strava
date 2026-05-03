import type { ResultStats } from "../types";
import { formatTime } from "./time";

export function createResultImageBlob(stats: ResultStats) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1400;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";
  ctx.font = "800 42px Space Grotesk, Arial";
  ctx.fillText("PAGE(S)", 450, 120);
  ctx.font = "800 136px Space Grotesk, Arial";
  ctx.fillText(String(stats.pagesRead), 450, 250);
  ctx.font = "800 42px Space Grotesk, Arial";
  ctx.fillText("PACE", 450, 400);
  ctx.font = "800 132px Space Grotesk, Arial";
  ctx.fillText(formatTime(stats.pace), 425, 540);
  ctx.font = "800 52px Space Grotesk, Arial";
  ctx.fillText("/p", 660, 540);
  ctx.font = "800 42px Space Grotesk, Arial";
  ctx.fillText("TIME", 450, 690);
  ctx.font = "800 136px Space Grotesk, Arial";
  ctx.fillText(formatTime(stats.elapsed), 450, 850);
  ctx.strokeStyle = "#ff6d1a";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(300, 1040);
  ctx.quadraticCurveTo(380, 990, 460, 1060);
  ctx.quadraticCurveTo(540, 940, 670, 1035);
  ctx.moveTo(300, 1040);
  ctx.lineTo(350, 1200);
  ctx.quadraticCurveTo(450, 1140, 530, 1195);
  ctx.moveTo(670, 1035);
  ctx.quadraticCurveTo(580, 1080, 530, 1195);
  ctx.moveTo(325, 1075);
  ctx.lineTo(385, 1180);
  ctx.quadraticCurveTo(445, 1155, 520, 1180);
  ctx.moveTo(655, 1070);
  ctx.quadraticCurveTo(590, 1090, 540, 1175);
  ctx.stroke();

  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
}

export async function copyBlobToClipboard(blob: Blob) {
  if (navigator.clipboard && window.ClipboardItem) {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  }
}
