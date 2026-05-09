import { formatTime } from "../utils/time";

type TimeDisplayProps = {
  seconds: number;
  className?: string;
};

export function TimeDisplay({ seconds, className = "" }: TimeDisplayProps) {
  const formattedTime = formatTime(seconds);
  const [minutes, remainingSeconds] = formattedTime.split(":");

  return (
    <strong
      aria-label={formattedTime}
      className={`grid grid-cols-[2ch_0.2em_2ch] items-center justify-center text-center tabular-nums ${className}`}
    >
      <span className="text-right" aria-hidden="true">
        {minutes}
      </span>
      <span
        className="flex h-[0.42em] translate-y-[0.08em] flex-col items-center justify-between self-center"
        aria-hidden="true"
      >
        <span className="h-[0.11em] w-[0.11em] rounded-full bg-current" />
        <span className="h-[0.11em] w-[0.11em] rounded-full bg-current" />
      </span>
      <span className="text-left" aria-hidden="true">
        {remainingSeconds}
      </span>
    </strong>
  );
}
