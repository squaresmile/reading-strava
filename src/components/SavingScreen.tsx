import { useState } from "react";

type SavingScreenProps = {
  startingPage: number;
  onSave: (endingPage: number) => void;
  onBack: () => void;
};

export function SavingScreen({
  startingPage,
  onSave,
  onBack,
}: SavingScreenProps) {
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
