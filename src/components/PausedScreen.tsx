import { TimeDisplay } from "./TimeDisplay";

type PausedScreenProps = {
  countdownSeconds: number | null;
  elapsedSeconds: number;
  onContinue: () => void;
  onSave: () => void;
  onDiscard: () => void;
};

export function PausedScreen({
  countdownSeconds,
  elapsedSeconds,
  onContinue,
  onSave,
  onDiscard,
}: PausedScreenProps) {
  const remainingSeconds =
    countdownSeconds === null
      ? elapsedSeconds
      : Math.max(0, countdownSeconds - elapsedSeconds);

  return (
    <section className="flex min-h-[100svh] flex-col px-[clamp(1rem,4vw,1.25rem)] pb-8 pt-[clamp(4.25rem,11svh,6.5rem)] [@media(max-height:740px)]:py-5 [@media(max-height:740px)]:pt-[3.25rem]">
      <div className="text-center">
        <p className="m-0 mb-5 text-[clamp(0.95rem,3.7vw,1.2rem)] uppercase tracking-[0.2em] text-orange">
          Paused
        </p>
        <TimeDisplay
          seconds={remainingSeconds}
          className="text-[clamp(4.15rem,18vw,6.35rem)] font-extrabold leading-[0.9] tracking-normal text-fg"
        />
        {countdownSeconds !== null && (
          <p className="m-0 mt-5 text-[clamp(1rem,4vw,1.2rem)] font-bold leading-none text-muted">
            remaining
          </p>
        )}
      </div>
      <div className="mt-[clamp(3.75rem,10svh,5.75rem)] flex flex-col gap-[clamp(1rem,3svh,1.35rem)] [@media(max-height:740px)]:mt-11">
        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-orange text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-white"
          onClick={onContinue}
        >
          Continue
        </button>
        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-panel text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-fg"
          onClick={onSave}
        >
          Save
        </button>
        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-panel text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-danger"
          onClick={onDiscard}
        >
          Discard
        </button>
      </div>
    </section>
  );
}
