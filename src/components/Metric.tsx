type MetricProps = {
  label: string;
  value: number | string;
  suffix?: string;
};

export function Metric({ label, value, suffix }: MetricProps) {
  return (
    <div>
      <p className="m-0 mb-4 text-[clamp(1.2rem,5vw,1.55rem)] font-extrabold uppercase tracking-[0.2em] text-fg">
        {label}
      </p>
      <strong className="block text-[clamp(4rem,18vw,6.4rem)] font-extrabold leading-[0.9] tracking-normal text-fg">
        {value}
        {suffix && <span className="ml-2 text-[0.36em]">{suffix}</span>}
      </strong>
    </div>
  );
}
