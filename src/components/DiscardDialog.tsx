type DiscardDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DiscardDialog({
  open,
  onCancel,
  onConfirm,
}: DiscardDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="discard-title"
        className="absolute inset-0 flex items-center justify-center p-5"
      >
        <div className="w-full max-w-[400px] rounded-2xl border border-fg/5 bg-panel p-7 font-display shadow-dialog">
          <h2
            id="discard-title"
            className="m-0 text-[clamp(1.25rem,5vw,1.5rem)] font-bold leading-tight text-fg"
          >
            Discard session?
          </h2>
          <p className="mb-7 mt-3 text-[clamp(0.95rem,3.7vw,1rem)] leading-relaxed text-muted">
            Are you sure you want to discard this session? This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <button
              className="min-h-14 w-full cursor-pointer rounded-xl border-0 bg-panel-strong text-[1rem] font-bold leading-none text-fg transition duration-150 hover:opacity-90 active:scale-[0.98]"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="min-h-14 w-full cursor-pointer rounded-xl border-0 bg-danger text-[1rem] font-bold leading-none text-white transition duration-150 hover:bg-[#b91c1c] active:scale-[0.98]"
              onClick={onConfirm}
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
