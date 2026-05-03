import { useMemo } from "react";

import { BookOpen } from "lucide-react";

import type { SessionResult } from "../types";
import {
  copyBlobToClipboard,
  createResultImageBlob,
} from "../utils/resultImage";
import { formatTime, secondsPerPage } from "../utils/time";
import { Metric } from "./Metric";

type ResultScreenProps = {
  data: SessionResult;
  onNewSession: () => void;
};

export function ResultScreen({ data, onNewSession }: ResultScreenProps) {
  const pagesRead = Math.max(0, data.endingPage - data.startingPage);
  const pace = secondsPerPage(data.elapsedSeconds, pagesRead);

  const stats = useMemo(
    () => ({
      pagesRead,
      pace,
      elapsed: data.elapsedSeconds,
    }),
    [data.elapsedSeconds, pagesRead, pace],
  );

  async function downloadImage() {
    const blob = await createResultImageBlob(stats);
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reading-strava-session.png";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function shareToInstagram() {
    const blob = await createResultImageBlob(stats);
    if (!blob) return;

    const file = new File([blob], "reading-strava-session.png", {
      type: "image/png",
    });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        text: "My Reading Strava session",
        title: "Reading Strava",
      });
      return;
    }

    await copyBlobToClipboard(blob);
  }

  return (
    <section className="flex min-h-[100svh] flex-col items-center px-[clamp(1rem,4vw,1.25rem)] pb-8 pt-[clamp(2rem,6svh,3.25rem)] [@media(max-height:740px)]:py-5">
      <div className="flex w-full flex-col gap-[clamp(2.2rem,6.8svh,3.55rem)] text-center [@media(max-height:740px)]:gap-6">
        <Metric label="Page(s)" value={stats.pagesRead} />
        <Metric label="Pace" value={formatTime(stats.pace)} suffix="/p" />
        <Metric label="Time" value={formatTime(stats.elapsed)} />
      </div>
      <BookOpen
        className="mb-[clamp(3rem,8svh,5rem)] mt-auto h-[clamp(8rem,38vw,11rem)] w-[clamp(8rem,38vw,11rem)] text-[#ff5a0a] [@media(max-height:740px)]:mb-8"
        size={210}
        strokeWidth={1.8}
      />
      <div className="flex w-full flex-col gap-[clamp(2rem,6svh,3rem)]">
        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-orange text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-white"
          onClick={shareToInstagram}
        >
          Share to Instagram
        </button>
        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-panel text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-white"
          onClick={downloadImage}
        >
          Download Image
        </button>
        <button
          className="self-center border-0 bg-transparent text-[clamp(1.05rem,4.3vw,1.35rem)] leading-none text-muted"
          onClick={onNewSession}
        >
          New Session
        </button>
      </div>
    </section>
  );
}
