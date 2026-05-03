import { Pause } from "lucide-react";

import { formatTime } from "../utils/time";

type TimingScreenProps = {
  elapsedSeconds: number;
  onPause: () => void;
};

export function TimingScreen({ elapsedSeconds, onPause }: TimingScreenProps) {
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
