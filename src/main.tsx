import React, { useCallback, useEffect, useMemo, useState } from "react";

import { createRoot } from "react-dom/client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { BookOpen, Pause } from "lucide-react";

import "./styles.css";

const STORAGE_KEY = "reading-tracker-session";

type Screen = "start" | "timing" | "paused" | "saving" | "result";

type SessionResult = {
  startingPage: number;
  endingPage: number;
  elapsedSeconds: number;
};

type SavedSession = {
  state?: Screen;
  startingPage?: string;
  startTimestamp?: number | null;
  totalPausedMs?: number;
  pauseTimestamp?: number | null;
};

type StartScreenProps = {
  startingPage: string;
  setStartingPage: (value: string) => void;
  onStart: () => void;
};

type TimingScreenProps = {
  elapsedSeconds: number;
  onPause: () => void;
};

type PausedScreenProps = {
  elapsedSeconds: number;
  onContinue: () => void;
  onSave: () => void;
  onDiscard: () => void;
};

type SavingScreenProps = {
  startingPage: number;
  onSave: (endingPage: number) => void;
  onBack: () => void;
};

type ResultScreenProps = {
  data: SessionResult;
  onNewSession: () => void;
};

type MetricProps = {
  label: string;
  value: number | string;
  suffix?: string;
};

type DiscardDialogProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function secondsPerPage(elapsedSeconds: number, pagesRead: number) {
  if (pagesRead <= 0) return 0;
  return Math.max(1, Math.round(elapsedSeconds / pagesRead));
}

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [startingPage, setStartingPage] = useState("");
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [totalPausedMs, setTotalPausedMs] = useState(0);
  const [pauseTimestamp, setPauseTimestamp] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const elapsedNow = useCallback(() => {
    if (!startTimestamp) return 0;
    const end =
      screen === "paused" && pauseTimestamp ? pauseTimestamp : Date.now();
    return Math.max(
      0,
      Math.floor((end - startTimestamp - totalPausedMs) / 1000),
    );
  }, [pauseTimestamp, screen, startTimestamp, totalPausedMs]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as SavedSession;
      setStartingPage(parsed.startingPage ?? "");
      setStartTimestamp(parsed.startTimestamp ?? null);
      setTotalPausedMs(parsed.totalPausedMs ?? 0);
      setPauseTimestamp(
        parsed.state === "timing"
          ? Date.now()
          : (parsed.pauseTimestamp ?? null),
      );
      if (parsed.state === "timing" || parsed.state === "paused")
        setScreen("paused");
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (screen !== "timing" && screen !== "paused") return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        state: screen,
        startingPage,
        startTimestamp,
        totalPausedMs,
        pauseTimestamp,
      }),
    );
  }, [pauseTimestamp, screen, startingPage, startTimestamp, totalPausedMs]);

  useEffect(() => {
    if (screen === "timing") {
      setElapsedSeconds(elapsedNow());
      const timer = window.setInterval(
        () => setElapsedSeconds(elapsedNow()),
        1000,
      );
      return () => window.clearInterval(timer);
    }
    if (screen === "paused") setElapsedSeconds(elapsedNow());
  }, [elapsedNow, screen]);

  function startReading() {
    if (startingPage === "" || Number.isNaN(Number(startingPage))) return;
    setStartTimestamp(Date.now());
    setTotalPausedMs(0);
    setPauseTimestamp(null);
    setElapsedSeconds(0);
    setScreen("timing");
  }

  function pauseReading() {
    setPauseTimestamp(Date.now());
    setScreen("paused");
  }

  function continueReading() {
    if (pauseTimestamp)
      setTotalPausedMs((value) => value + Date.now() - pauseTimestamp);
    setPauseTimestamp(null);
    setScreen("timing");
  }

  function discard() {
    setStartingPage("");
    setStartTimestamp(null);
    setTotalPausedMs(0);
    setPauseTimestamp(null);
    setResult(null);
    setConfirmDiscard(false);
    localStorage.removeItem(STORAGE_KEY);
    setScreen("start");
  }

  function saveSession(endingPage: number) {
    const elapsed = elapsedNow();
    setResult({
      startingPage: Number(startingPage),
      endingPage,
      elapsedSeconds: elapsed,
    });
    localStorage.removeItem(STORAGE_KEY);
    setScreen("result");
  }

  function newSession() {
    setStartingPage("");
    setStartTimestamp(null);
    setTotalPausedMs(0);
    setPauseTimestamp(null);
    setResult(null);
    setScreen("start");
  }

  return (
    <main className="flex min-h-screen justify-center bg-page font-display text-white">
      <div className="relative min-h-[100svh] w-full max-w-[430px]">
        {screen === "start" && (
          <StartScreen
            startingPage={startingPage}
            setStartingPage={setStartingPage}
            onStart={startReading}
          />
        )}
        {screen === "timing" && (
          <TimingScreen
            elapsedSeconds={elapsedSeconds}
            onPause={pauseReading}
          />
        )}
        {screen === "paused" && (
          <PausedScreen
            elapsedSeconds={elapsedSeconds}
            onContinue={continueReading}
            onSave={() => setScreen("saving")}
            onDiscard={() => setConfirmDiscard(true)}
          />
        )}
        {screen === "saving" && (
          <SavingScreen
            startingPage={Number(startingPage)}
            onBack={() => setScreen("paused")}
            onSave={saveSession}
          />
        )}
        {screen === "result" && result && (
          <ResultScreen data={result} onNewSession={newSession} />
        )}
      </div>
      {confirmDiscard && (
        <DiscardDialog
          onCancel={() => setConfirmDiscard(false)}
          onConfirm={discard}
        />
      )}
    </main>
  );
}

function StartScreen({
  startingPage,
  setStartingPage,
  onStart,
}: StartScreenProps) {
  const disabled = startingPage === "" || Number.isNaN(Number(startingPage));
  return (
    <section className="flex min-h-[100svh] flex-col px-[clamp(1rem,4vw,1.25rem)] pb-8 pt-[clamp(4.75rem,13svh,8.25rem)] [@media(max-height:740px)]:py-5">
      <header className="text-center">
        <h1 className="m-0 text-[clamp(2.15rem,9vw,3rem)] font-extrabold leading-none tracking-normal">
          Reading Tracker
        </h1>
        <p className="m-0 mt-4 text-[clamp(1.05rem,4.4vw,1.35rem)] font-normal leading-tight text-muted">
          Track your reading sessions
        </p>
      </header>
      <div className="mt-[clamp(4rem,11svh,6.25rem)] flex flex-col gap-[clamp(1.75rem,5svh,2.65rem)] [@media(max-height:740px)]:mt-11">
        <label className="flex flex-col gap-4">
          <span className="text-[clamp(0.95rem,3.8vw,1.25rem)] uppercase leading-none tracking-[0.2em] text-muted-label">
            Starting Page
          </span>
          <input
            className="h-[clamp(6.5rem,18svh,8.25rem)] w-full rounded-[1.15rem] border-[3px] border-transparent bg-panel text-center text-[clamp(2.8rem,13vw,3.8rem)] font-extrabold text-[#4d4d52] outline-none transition-colors duration-150 focus:border-orange"
            type="number"
            min="0"
            value={startingPage}
            onChange={(event) => setStartingPage(event.target.value)}
            placeholder="0"
          />
        </label>
        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] bg-orange text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-white disabled:cursor-default disabled:bg-orange-dim disabled:text-[#5f5f62]"
          disabled={disabled}
          onClick={onStart}
        >
          Start Reading
        </button>
      </div>
    </section>
  );
}

function TimingScreen({ elapsedSeconds, onPause }: TimingScreenProps) {
  return (
    <section className="flex min-h-[100svh] flex-col items-center px-[clamp(1rem,4vw,1.25rem)] pb-8 pt-[clamp(5.5rem,16svh,9rem)] [@media(max-height:740px)]:py-5 [@media(max-height:740px)]:pt-[3.25rem]">
      <div className="text-center">
        <p className="m-0 mb-5 text-[clamp(0.95rem,3.7vw,1.2rem)] uppercase tracking-[0.2em] text-muted">
          Reading
        </p>
        <strong className="block text-[clamp(4.15rem,18vw,6.4rem)] font-extrabold leading-[0.9] tracking-normal text-white">
          {formatTime(elapsedSeconds)}
        </strong>
      </div>
      <button
        className="mt-[clamp(4.5rem,13svh,7rem)] inline-flex h-[clamp(6.75rem,28vw,8.25rem)] w-[clamp(6.75rem,28vw,8.25rem)] cursor-pointer items-center justify-center rounded-full border-0 bg-panel text-white shadow-pause-ring max-[520px]:[&_svg]:size-11 [@media(max-height:740px)]:mt-12"
        aria-label="Pause reading"
        onClick={onPause}
      >
        <Pause size={52} strokeWidth={4} fill="currentColor" />
      </button>
    </section>
  );
}

function PausedScreen({
  elapsedSeconds,
  onContinue,
  onSave,
  onDiscard,
}: PausedScreenProps) {
  return (
    <section className="flex min-h-[100svh] flex-col px-[clamp(1rem,4vw,1.25rem)] pb-8 pt-[clamp(4.25rem,11svh,6.5rem)] [@media(max-height:740px)]:py-5 [@media(max-height:740px)]:pt-[3.25rem]">
      <div className="text-center">
        <p className="m-0 mb-5 text-[clamp(0.95rem,3.7vw,1.2rem)] uppercase tracking-[0.2em] text-orange">
          Paused
        </p>
        <strong className="block text-[clamp(4.15rem,18vw,6.35rem)] font-extrabold leading-[0.9] tracking-normal text-white">
          {formatTime(elapsedSeconds)}
        </strong>
      </div>
      <div className="mt-[clamp(3.75rem,10svh,5.75rem)] flex flex-col gap-[clamp(1rem,3svh,1.35rem)] [@media(max-height:740px)]:mt-11">
        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-orange text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-white"
          onClick={onContinue}
        >
          Continue
        </button>
        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-panel text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-white"
          onClick={onSave}
        >
          Save
        </button>
        <button
          className="mt-[clamp(1.25rem,4svh,2rem)] self-center border-0 bg-transparent text-[clamp(1.05rem,4.3vw,1.35rem)] leading-none text-muted"
          onClick={onDiscard}
        >
          Discard
        </button>
      </div>
    </section>
  );
}

function SavingScreen({ startingPage, onSave, onBack }: SavingScreenProps) {
  const [endingPage, setEndingPage] = useState("");
  const disabled = endingPage === "" || Number.isNaN(Number(endingPage));
  return (
    <section className="flex min-h-[100svh] flex-col px-[clamp(1rem,4vw,1.25rem)] pb-8 pt-[clamp(4.75rem,13svh,8rem)] [@media(max-height:740px)]:py-5 [@media(max-height:740px)]:pt-[3.25rem]">
      <header className="text-center">
        <h1 className="m-0 text-[clamp(2.1rem,8.5vw,2.85rem)] font-extrabold leading-none tracking-normal">
          Where did you stop?
        </h1>
        <p className="m-0 mt-4 text-[clamp(1.05rem,4.4vw,1.35rem)] font-normal leading-tight text-muted">
          Started on page {startingPage}
        </p>
      </header>
      <div className="mt-[clamp(3.75rem,10svh,6.25rem)] flex flex-col gap-[clamp(1.55rem,4.5svh,2.35rem)] [@media(max-height:740px)]:mt-11">
        <label className="flex flex-col gap-4">
          <span className="text-[clamp(0.95rem,3.8vw,1.25rem)] uppercase leading-none tracking-[0.2em] text-muted-label">
            Ending Page
          </span>
          <input
            className="h-[clamp(6.5rem,18svh,8.25rem)] w-full rounded-[1.15rem] border-[3px] border-orange bg-panel text-center text-[clamp(2.8rem,13vw,3.8rem)] font-extrabold text-[#4d4d52] outline-none transition-colors duration-150 focus:border-orange"
            type="number"
            min="0"
            value={endingPage}
            onChange={(event) => setEndingPage(event.target.value)}
            placeholder="0"
            autoFocus
          />
        </label>
        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-orange text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-white disabled:cursor-default disabled:bg-orange-dim disabled:text-[#5f5f62]"
          disabled={disabled}
          onClick={() => onSave(Number(endingPage))}
        >
          Save Session
        </button>
        <button
          className="mt-[clamp(1rem,4svh,1.75rem)] self-center border-0 bg-transparent text-[clamp(1.05rem,4.3vw,1.35rem)] leading-none text-muted"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </section>
  );
}

function ResultScreen({ data, onNewSession }: ResultScreenProps) {
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

  async function copyImage() {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
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

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (blob && navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
    }
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
          onClick={copyImage}
        >
          Copy Image
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

function Metric({ label, value, suffix }: MetricProps) {
  return (
    <div>
      <p className="m-0 mb-4 text-[clamp(1.2rem,5vw,1.55rem)] font-extrabold uppercase tracking-[0.2em] text-white">
        {label}
      </p>
      <strong className="block text-[clamp(4rem,18vw,6.4rem)] font-extrabold leading-[0.9] tracking-normal text-white">
        {value}
        {suffix && <span className="ml-2 text-[0.36em]">{suffix}</span>}
      </strong>
    </div>
  );
}

function DiscardDialog({ onCancel, onConfirm }: DiscardDialogProps) {
  return (
    <Dialog open onClose={onCancel} className="relative z-10">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-6">
        <DialogPanel className="w-full max-w-[360px] rounded-xl border border-[#2e2e2e] bg-[#111] p-6 shadow-dialog">
          <DialogTitle id="discard-title" className="m-0 text-lg font-bold">
            Discard session?
          </DialogTitle>
          <p className="mb-5 mt-3 text-[0.95rem] text-muted">
            Are you sure you want to discard this session? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="min-h-12 w-full cursor-pointer rounded-lg border-0 bg-panel text-[0.95rem] font-bold leading-none text-white"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="min-h-12 w-full cursor-pointer rounded-lg border-0 bg-danger text-[0.95rem] font-bold leading-none text-white"
              onClick={onConfirm}
            >
              Discard
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(<App />);
