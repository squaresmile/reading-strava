import { useMemo } from "react";

import { BookOpen } from "lucide-react";

import type { SessionResult } from "../types";
import { createResultImageBlob } from "../utils/resultImage";
import { formatTime, secondsPerPage } from "../utils/time";
import { Metric } from "./Metric";

type ResultScreenProps = {
  data: SessionResult;
  onNewSession: () => void;
};

function readingSpeedLabel(pace: number, pagesRead: number) {
  if (pagesRead <= 0) return "📖 No Pages Logged";
  if (pace <= 45) return "⚡ Page Sprinter";
  if (pace <= 90) return "🚲 Cruising";
  if (pace <= 180) return "🧠 Deep Focus";
  return "🕯️ Slow Burn";
}

export function ResultScreen({ data, onNewSession }: ResultScreenProps) {
  const pagesRead = Math.max(0, data.endingPage - data.startingPage);
  const pace = secondsPerPage(data.elapsedSeconds, pagesRead);
  const speedLabel = readingSpeedLabel(pace, pagesRead);

  const stats = useMemo(
    () => ({
      bookTitle: data.bookTitle,
      pagesRead,
      pace,
      elapsed: data.elapsedSeconds,
      speedLabel,
    }),
    [data.bookTitle, data.elapsedSeconds, pagesRead, pace, speedLabel],
  );

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "reading-strava-session.png";
    document.body.append(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  async function downloadImage() {
    const blob = await createResultImageBlob(stats);
    if (!blob) return;

    downloadBlob(blob);
  }

  async function shareImage() {
    const blob = await createResultImageBlob(stats);
    if (!blob) return;

    const file = new File([blob], "reading-strava-session.png", {
      type: "image/png",
    });

    if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
      downloadBlob(blob);
      return;
    }

    await navigator.share({
      files: [file],
      text: "My Reading Strava session",
      title: "Reading Strava",
    });
  }

  return (
    <section className="flex min-h-[100dvh] flex-col items-center px-[clamp(1rem,4vw,1.25rem)] pb-[clamp(2rem,6svh,4rem)] pt-[clamp(2rem,6svh,3.25rem)] [@media(max-height:740px)]:pb-6 [@media(max-height:740px)]:pt-5">
      {stats.bookTitle && (
        <header className="mb-[clamp(1.5rem,4svh,2.4rem)] w-full text-center">
          <p className="m-0 truncate text-[clamp(1.2rem,4.8vw,1.55rem)] font-extrabold leading-tight text-fg">
            {stats.bookTitle}
          </p>
        </header>
      )}

      <div className="flex w-full flex-col gap-[clamp(2.2rem,6.8svh,3.55rem)] text-center [@media(max-height:740px)]:gap-6">
        <Metric
          label={stats.pagesRead > 1 ? "Pages" : "Page"}
          value={stats.pagesRead}
        />
        <div>
          <Metric label="Pace" value={formatTime(stats.pace)} suffix="/p" />
          <p className="m-0 mt-4 text-[clamp(0.95rem,3.7vw,1.1rem)] font-bold uppercase leading-none tracking-[0.18em] text-orange">
            {stats.speedLabel}
          </p>
        </div>
        <Metric label="Time" value={formatTime(stats.elapsed)} />
      </div>

      <BookOpen
        className="mb-[clamp(2rem,5svh,3.5rem)] mt-auto h-[clamp(8rem,38vw,11rem)] w-[clamp(8rem,38vw,11rem)] text-[#ff5a0a] [@media(max-height:740px)]:mb-6"
        size={210}
        strokeWidth={1.8}
      />

      <div className="flex w-full flex-col gap-[clamp(1.25rem,3.8svh,2rem)]">
        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-orange text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-white"
          onClick={shareImage}
        >
          Share Image
        </button>

        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-panel text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-fg"
          onClick={downloadImage}
        >
          Download Image
        </button>

        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-panel text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-fg"
          onClick={onNewSession}
        >
          New Session
        </button>
      </div>
    </section>
  );
}
