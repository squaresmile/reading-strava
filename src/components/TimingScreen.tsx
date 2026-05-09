import { formatTime } from "../utils/time";
import { TimeDisplay } from "./TimeDisplay";

type TimingScreenProps = {
  countdownSeconds: number | null;
  elapsedSeconds: number;
  onPause: () => void;
};

export function TimingScreen({
  countdownSeconds,
  elapsedSeconds,
  onPause,
}: TimingScreenProps) {
  const remainingSeconds =
    countdownSeconds === null
      ? elapsedSeconds
      : Math.max(0, countdownSeconds - elapsedSeconds);

  return (
    <section className="flex min-h-[100svh] flex-col items-center px-[clamp(1rem,4vw,1.25rem)] pb-8 pt-[clamp(5.5rem,16svh,9rem)] [@media(max-height:740px)]:py-5 [@media(max-height:740px)]:pt-[3.25rem]">
      <div className="text-center">
        <p className="m-0 mb-5 text-[clamp(0.95rem,3.7vw,1.2rem)] uppercase tracking-[0.2em] text-muted">
          {countdownSeconds === null ? "Reading" : "Time Left"}
        </p>
        <TimeDisplay
          seconds={remainingSeconds}
          className="text-[clamp(4.15rem,18vw,6.4rem)] font-extrabold leading-[0.9] tracking-normal text-fg"
        />
        {countdownSeconds !== null && (
          <p className="m-0 mt-5 text-[clamp(1rem,4vw,1.2rem)] font-bold leading-none text-muted">
            {formatTime(elapsedSeconds)} elapsed
          </p>
        )}
      </div>
      <button
        className="mt-[clamp(4.5rem,13svh,7rem)] inline-flex h-[clamp(5.75rem,23vw,7rem)] w-[clamp(5.75rem,23vw,7rem)] cursor-pointer items-center justify-center rounded-full border border-orange/30 bg-panel text-fg shadow-[inset_0_0_0_1px_rgb(255_113_28_/_0.06),0_1.25rem_3.5rem_rgb(255_113_28_/_0.18)] transition duration-150 hover:border-orange hover:bg-panel-strong hover:text-orange hover:shadow-[inset_0_0_0_1px_rgb(255_113_28_/_0.4),0_0_2.5rem_rgb(255_113_28_/_0.55),0_1.25rem_3.5rem_rgb(255_113_28_/_0.35)] active:scale-95 [@media(max-height:740px)]:mt-12"
        aria-label="Pause reading"
        onClick={onPause}
      >
        <svg
          className="h-[clamp(2.2rem,8vw,2.75rem)] w-[clamp(2.2rem,8vw,2.75rem)] text-fg"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <rect
            width="12"
            height="32"
            x="10"
            y="8"
            rx="5"
            fill="currentColor"
          />
          <rect
            width="12"
            height="32"
            x="26"
            y="8"
            rx="5"
            fill="currentColor"
          />
        </svg>
      </button>
    </section>
  );
}
