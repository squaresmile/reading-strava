type StartScreenProps = {
  startingPage: string;
  setStartingPage: (value: string) => void;
  onStart: () => void;
};

export function StartScreen({
  startingPage,
  setStartingPage,
  onStart,
}: StartScreenProps) {
  const disabled = startingPage === "" || Number.isNaN(Number(startingPage));

  return (
    <section className="flex h-[100svh] flex-col justify-center overflow-hidden px-[clamp(1.25rem,5vw,2rem)] py-[clamp(1.25rem,5svh,3rem)]">
      <header className="text-center">
        <h1 className="m-0 text-[clamp(2.15rem,9vw,3rem)] font-extrabold leading-none tracking-normal">
          Reading Tracker
        </h1>
        <p className="m-0 mt-4 text-[clamp(1.05rem,4.4vw,1.35rem)] font-normal leading-tight text-muted">
          Track your reading sessions
        </p>
      </header>
      <div className="mt-[clamp(2rem,7svh,4rem)] flex flex-col gap-[clamp(2rem,6svh,3.5rem)]">
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
