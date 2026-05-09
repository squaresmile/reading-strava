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
  const tooLow =
    endingPage !== "" &&
    !Number.isNaN(Number(endingPage)) &&
    Number(endingPage) < startingPage;
  const disabled =
    endingPage === "" || Number.isNaN(Number(endingPage)) || tooLow;

  return (
    <section className="flex min-h-[100dvh] flex-col px-[clamp(1rem,4vw,1.25rem)] pb-[clamp(2rem,6svh,4rem)] pt-[clamp(4.75rem,13svh,8rem)] [@media(max-height:740px)]:pb-6 [@media(max-height:740px)]:pt-[3.25rem]">
      <header className="text-center">
        <h1 className="m-0 whitespace-nowrap text-[clamp(1.6rem,6.5vw,2.25rem)] font-extrabold leading-none tracking-normal">
          Where did you stop?
        </h1>

        <p className="m-0 mt-4 text-[clamp(1.05rem,4.4vw,1.35rem)] font-normal leading-tight text-muted">
          Started on page {startingPage}
        </p>
      </header>

      <div className="mt-[clamp(3.75rem,10svh,6.25rem)] flex flex-col gap-[clamp(1.25rem,3.8svh,2rem)] [@media(max-height:740px)]:mt-11">
        <label className="flex flex-col gap-5 pt-[0.5rem]">
          <span className="block min-h-[1.75rem] text-center text-[clamp(0.95rem,3.8vw,1.25rem)] uppercase leading-none tracking-[0.2em] text-muted-label">
            Ending Page
          </span>

          <input
            className="h-[clamp(6.5rem,18svh,8.25rem)] w-full appearance-none rounded-[1.35rem] border-[3px] border-orange/40 bg-panel text-center text-[clamp(2.8rem,13vw,3.8rem)] font-extrabold text-fg/35 shadow-[0_1.5rem_4rem_rgb(255_113_28_/_0.14)] outline-none transition-colors duration-150 [appearance:textfield] focus:border-orange focus:text-fg [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            type="number"
            min={startingPage}
            value={endingPage}
            onChange={(event) => setEndingPage(event.target.value)}
            placeholder="0"
            autoFocus
          />
          <span
            aria-live="polite"
            className={`min-h-[1.25rem] text-center text-[clamp(0.85rem,3.4vw,1rem)] leading-tight text-orange ${
              tooLow ? "visible" : "invisible"
            }`}
          >
            Ending page can't be before page {startingPage}
          </span>
        </label>

        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-orange text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-white disabled:cursor-default disabled:bg-orange-dim disabled:text-muted"
          disabled={disabled}
          onClick={() => onSave(Number(endingPage))}
        >
          Save Session
        </button>

        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] border-0 bg-panel text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-fg"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </section>
  );
}
