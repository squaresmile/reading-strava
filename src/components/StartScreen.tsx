import type { SessionMode } from "../types";

const COUNTDOWN_PRESETS = [15, 30, 45, 60];

type StartScreenProps = {
  countdownMinutes: number;
  startingPage: string;
  sessionMode: SessionMode;
  setCountdownMinutes: (value: number) => void;
  setStartingPage: (value: string) => void;
  setSessionMode: (value: SessionMode) => void;
  onStart: () => void;
};

export function StartScreen({
  countdownMinutes,
  startingPage,
  sessionMode,
  setCountdownMinutes,
  setStartingPage,
  setSessionMode,
  onStart,
}: StartScreenProps) {
  const customCountdownValue =
    countdownMinutes > 0 ? String(countdownMinutes) : "";
  const countdownInvalid =
    sessionMode === "countdown" &&
    (!Number.isFinite(countdownMinutes) || countdownMinutes < 1);
  const disabled =
    startingPage === "" ||
    Number.isNaN(Number(startingPage)) ||
    countdownInvalid;

  return (
    <section className="flex min-h-[100svh] flex-col justify-center overflow-hidden px-[clamp(1.25rem,5vw,2rem)] py-[clamp(1.25rem,4svh,2.25rem)]">
      <header className="text-center">
        <h1 className="m-0 text-[clamp(2.15rem,9vw,3rem)] font-extrabold leading-none tracking-normal">
          Reading Tracker
        </h1>
        <p className="m-0 mt-4 text-[clamp(1.05rem,4.4vw,1.35rem)] font-normal leading-tight text-muted">
          Track your reading sessions
        </p>
      </header>
      <div className="mt-[clamp(1.75rem,5svh,3rem)] flex flex-col gap-[clamp(1.35rem,4svh,2.5rem)]">
        <div className="flex flex-col gap-5 pt-[0.5rem]">
          <label
            className="block min-h-[1.75rem] text-center text-[clamp(0.95rem,3.8vw,1.25rem)] uppercase leading-none tracking-[0.2em] text-muted-label"
            htmlFor="starting-page"
          >
            Starting Page
          </label>
          <input
            className="h-[clamp(5.25rem,15svh,7rem)] w-full appearance-none rounded-[1.35rem] border-[3px] border-orange/40 bg-panel text-center text-[clamp(2.5rem,11vw,3.4rem)] font-extrabold text-fg/35 shadow-[0_1.5rem_4rem_rgb(255_113_28_/_0.14)] outline-none transition-colors duration-150 [appearance:textfield] focus:border-orange focus:text-fg [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            id="starting-page"
            type="number"
            min="0"
            value={startingPage}
            onChange={(event) => setStartingPage(event.target.value)}
            placeholder="0"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="relative grid grid-cols-2 overflow-hidden rounded-[1.15rem] bg-panel p-1"
            role="group"
            aria-label="Session mode"
          >
            <span
              className={`absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/2)] rounded-[0.9rem] bg-orange transition-transform duration-300 ease-out ${
                sessionMode === "countdown" ? "translate-x-full" : ""
              }`}
              aria-hidden="true"
            />
            <button
              type="button"
              className={`relative z-10 min-h-14 cursor-pointer rounded-[0.9rem] border-0 bg-transparent text-[clamp(1rem,4vw,1.15rem)] font-bold transition-colors duration-200 ${
                sessionMode === "stopwatch"
                  ? "text-white"
                  : "text-muted hover:text-fg"
              }`}
              onClick={() => setSessionMode("stopwatch")}
            >
              Stopwatch
            </button>
            <button
              type="button"
              className={`relative z-10 min-h-14 cursor-pointer rounded-[0.9rem] border-0 bg-transparent text-[clamp(1rem,4vw,1.15rem)] font-bold transition-colors duration-200 ${
                sessionMode === "countdown"
                  ? "text-white"
                  : "text-muted hover:text-fg"
              }`}
              onClick={() => setSessionMode("countdown")}
            >
              Countdown
            </button>
          </div>

          <div
            className={`grid transition-[grid-template-rows,opacity,transform] duration-300 ease-out ${
              sessionMode === "countdown"
                ? "grid-rows-[1fr] opacity-100"
                : "pointer-events-none grid-rows-[0fr] -translate-y-2 opacity-0"
            }`}
            aria-hidden={sessionMode !== "countdown"}
          >
            <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
              <div className="grid grid-cols-4 gap-2">
                {COUNTDOWN_PRESETS.map((minutes) => (
                  <button
                    type="button"
                    key={minutes}
                    disabled={sessionMode !== "countdown"}
                    tabIndex={sessionMode === "countdown" ? 0 : -1}
                    className={`min-h-12 cursor-pointer rounded-xl border-0 text-[clamp(0.9rem,3.4vw,1.05rem)] font-bold transition-colors ${
                      countdownMinutes === minutes
                        ? "bg-orange text-white"
                        : "bg-panel text-fg"
                    }`}
                    onClick={() => setCountdownMinutes(minutes)}
                  >
                    {minutes === 60 ? "1h" : `${minutes}m`}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-3 rounded-xl bg-panel px-4 py-3">
                <span className="text-[clamp(0.9rem,3.4vw,1rem)] font-bold uppercase leading-none tracking-[0.16em] text-muted-label">
                  Custom
                </span>
                <input
                  className="min-w-0 flex-1 appearance-none bg-transparent text-right text-[clamp(1.35rem,5vw,1.7rem)] font-extrabold leading-none text-fg outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={customCountdownValue}
                  disabled={sessionMode !== "countdown"}
                  tabIndex={sessionMode === "countdown" ? 0 : -1}
                  onChange={(event) =>
                    setCountdownMinutes(Number(event.target.value))
                  }
                  placeholder="20"
                  aria-label="Custom countdown minutes"
                />
                <span className="text-[clamp(0.95rem,3.6vw,1.05rem)] font-bold leading-none text-muted">
                  min
                </span>
              </label>
            </div>
          </div>
        </div>

        <button
          className="min-h-[clamp(4.25rem,11svh,5.5rem)] w-full cursor-pointer rounded-[1.35rem] bg-orange text-[clamp(1.2rem,4.8vw,1.6rem)] font-bold leading-none text-white shadow-[0_1rem_3rem_rgb(255_113_28_/_0.28)] disabled:cursor-default disabled:bg-orange-dim disabled:text-muted disabled:shadow-none"
          disabled={disabled}
          onClick={onStart}
        >
          Start Reading
        </button>
      </div>
    </section>
  );
}
