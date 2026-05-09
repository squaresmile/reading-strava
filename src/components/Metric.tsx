import type { ReactNode } from "react";

type MetricProps = {
  label: string;
  value?: number | string;
  valueClassName?: string;
  suffix?: string;
  children?: ReactNode;
};

export function Metric({
  children,
  label,
  value,
  valueClassName = "text-[clamp(4rem,18vw,6.4rem)]",
  suffix,
}: MetricProps) {
  return (
    <div>
      <p className="m-0 mb-4 text-[clamp(1.2rem,5vw,1.55rem)] font-extrabold uppercase tracking-[0.2em] text-fg">
        {label}
      </p>
      {children ?? (
        <strong
          className={`block font-extrabold leading-[0.9] tracking-normal text-fg ${valueClassName}`}
        >
          {value}
          {suffix && <span className="ml-2 text-[0.36em]">{suffix}</span>}
        </strong>
      )}
    </div>
  );
}
