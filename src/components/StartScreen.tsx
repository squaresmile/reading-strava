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
    <section className="flex min-h-[100svh] flex-col px-[clamp(1rem,4vw,1.25rem)] pb-8 pt-[clamp(4.75rem,13svh,8.25rem)] [@media(max-height:740px)]:py-5">
      <header className="text-center">
        <h1 className="m-0 text-[clamp(2.15rem,9vw,3rem)] font-extrabold leading-none tracking-normal">
          Reading Tracker
        </h1>
        <p className="m-0 mt-4 text-[clamp(1.05rem,4.4vw,1.35rem)] font-normal leading-tight text-muted">
          Track your reading sessions
        </p>
      </header>
      <div className="mt-[clamp(4rem,11svh,6.25rem)] flex flex-col gap-[clamp(1.75rem,5svh,2.65rem)] [@media(max-height:740px)]:mt-11">
        <label className="flex flex-col gap-4">
          <span className="text-[clamp(0.95rem,3.8vw,1.25rem)] uppercase leading-none tracking-[0.2em] text-muted-label">
            Starting Page
          </span>
          <input
            className="h-[clamp(6.5rem,18svh,8.25rem)] w-full rounded-[1.15rem] border-[3px] border-transparent bg-panel text-center text-[clamp(2.8rem,13vw,3.8rem)] font-extrabold text-[#4d4d52] outline-none transition-colors duration-150 focus:border-orange"
            type="number"
            min="0"
            value={startingPage}
            onChange={(event) => setStartingPage(event.target.value)}
            placeholder="0"
          />
        </label>
        <button
          className="min-h-[clamp(4.75rem,13svh,6.25rem)] w-full cursor-pointer rounded-[1.15rem] bg-orange text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-none text-white disabled:cursor-default disabled:bg-orange-dim disabled:text-[#5f5f62]"
          disabled={disabled}
          onClick={onStart}
        >
          Start Reading
        </button>
      </div>
    </section>
  );
}
