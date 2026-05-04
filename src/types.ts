export type Screen = "start" | "timing" | "paused" | "saving" | "result";

export type SessionMode = "stopwatch" | "countdown";

export type SessionResult = {
  startingPage: number;
  endingPage: number;
  elapsedSeconds: number;
};

export type SavedSession = {
  state?: Screen;
  startingPage?: string;
  sessionMode?: SessionMode;
  countdownMinutes?: number;
  startTimestamp?: number | null;
  totalPausedMs?: number;
  pauseTimestamp?: number | null;
};

export type ResultStats = {
  pagesRead: number;
  pace: number;
  elapsed: number;
};
