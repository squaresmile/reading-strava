import { useEffect, useMemo, useRef } from "react";

import { createResultImageCanvas } from "../utils/resultImage";

function numberParam(params: URLSearchParams, key: string, fallback: number) {
  const value = Number(params.get(key));

  return Number.isFinite(value) ? value : fallback;
}

export function DebugResultImageScreen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stats = useMemo(() => {
    const params = new URLSearchParams(window.location.search);

    return {
      bookTitle: params.get("title") || "Debug Export",
      elapsed: numberParam(params, "elapsed", 125),
      pace: numberParam(params, "pace", 61),
      pagesRead: numberParam(params, "pages", 14),
      speedLabel: params.get("speed") || "⚡ Page Sprinter",
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const rendered = createResultImageCanvas(stats);
    const ctx = canvas?.getContext("2d");
    if (!canvas || !rendered || !ctx) return;

    canvas.width = rendered.width;
    canvas.height = rendered.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(rendered, 0, 0);
  }, [stats]);

  return (
    <main className="min-h-[100svh] bg-[#111] px-4 py-6 text-white">
      <div className="mx-auto flex max-w-[520px] flex-col gap-4">
        <canvas
          ref={canvasRef}
          className="h-auto w-full bg-[#222]"
          aria-label="Debug result image export canvas"
        />
      </div>
    </main>
  );
}
