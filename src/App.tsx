import { useCallback, useEffect, useState } from "react";

import { Moon, Sun } from "lucide-react";

import { DiscardDialog } from "./components/DiscardDialog";
import { PausedScreen } from "./components/PausedScreen";
import { ResultScreen } from "./components/ResultScreen";
import { SavingScreen } from "./components/SavingScreen";
import { StartScreen } from "./components/StartScreen";
import { TimingScreen } from "./components/TimingScreen";
import type { SavedSession, Screen, SessionMode, SessionResult } from "./types";

const STORAGE_KEY = "reading-tracker-session";
const THEME_KEY = "reading-tracker-theme";

type Theme = "dark" | "light";

export function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [theme, setTheme] = useState<Theme>(() => {
    const saved =
      typeof window === "undefined"
        ? null
        : (localStorage.getItem(THEME_KEY) as Theme | null);
    if (saved === "light" || saved === "dark") return saved;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    )
      return "light";
    return "dark";
  });
  const [bookTitle, setBookTitle] = useState("");
  const [startingPage, setStartingPage] = useState("");
  const [sessionMode, setSessionMode] = useState<SessionMode>("stopwatch");
  const [countdownMinutes, setCountdownMinutes] = useState(15);
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
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as SavedSession;
      setBookTitle(parsed.bookTitle ?? "");
      setStartingPage(parsed.startingPage ?? "");
      setSessionMode(
        parsed.sessionMode === "countdown" ? "countdown" : "stopwatch",
      );
      setCountdownMinutes(parsed.countdownMinutes ?? 15);
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
        bookTitle,
        startingPage,
        sessionMode,
        countdownMinutes,
        startTimestamp,
        totalPausedMs,
        pauseTimestamp,
      }),
    );
  }, [
    bookTitle,
    countdownMinutes,
    pauseTimestamp,
    screen,
    sessionMode,
    startingPage,
    startTimestamp,
    totalPausedMs,
  ]);

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

  useEffect(() => {
    if (screen !== "timing" || sessionMode !== "countdown") return;
    if (elapsedSeconds < countdownMinutes * 60) return;

    setPauseTimestamp(Date.now());
    setScreen("paused");
  }, [countdownMinutes, elapsedSeconds, screen, sessionMode]);

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
    setBookTitle("");
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
      bookTitle: bookTitle.trim() || undefined,
      startingPage: Number(startingPage),
      endingPage,
      elapsedSeconds: elapsed,
    });
    localStorage.removeItem(STORAGE_KEY);
    setScreen("result");
  }

  function newSession() {
    setBookTitle("");
    setStartingPage("");
    setStartTimestamp(null);
    setTotalPausedMs(0);
    setPauseTimestamp(null);
    setResult(null);
    setScreen("start");
  }

  return (
    <main className="flex justify-center bg-page font-display text-fg">
      <div className="relative w-full max-w-[430px]">
        <button
          type="button"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-fg/10 bg-panel text-muted transition-colors hover:text-fg"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Moon className="h-5 w-5" strokeWidth={2} />
          )}
        </button>
        {screen === "start" && (
          <StartScreen
            bookTitle={bookTitle}
            countdownMinutes={countdownMinutes}
            startingPage={startingPage}
            sessionMode={sessionMode}
            setBookTitle={setBookTitle}
            setCountdownMinutes={setCountdownMinutes}
            setStartingPage={setStartingPage}
            setSessionMode={setSessionMode}
            onStart={startReading}
          />
        )}
        {screen === "timing" && (
          <TimingScreen
            countdownSeconds={
              sessionMode === "countdown" ? countdownMinutes * 60 : null
            }
            elapsedSeconds={elapsedSeconds}
            onPause={pauseReading}
          />
        )}
        {screen === "paused" && (
          <PausedScreen
            countdownSeconds={
              sessionMode === "countdown" ? countdownMinutes * 60 : null
            }
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
          <ResultScreen
            data={result}
            onNewSession={newSession}
            onBookTitleChange={(value) =>
              setResult((prev) =>
                prev ? { ...prev, bookTitle: value || undefined } : prev,
              )
            }
          />
        )}
      </div>
      <DiscardDialog
        open={confirmDiscard}
        onCancel={() => setConfirmDiscard(false)}
        onConfirm={discard}
      />
    </main>
  );
}
