import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

type DiscardDialogProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function DiscardDialog({ onCancel, onConfirm }: DiscardDialogProps) {
  return (
    <Dialog open onClose={onCancel} className="relative z-10">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-6">
        <DialogPanel className="w-full max-w-[360px] rounded-xl border border-[#2e2e2e] bg-[#111] p-6 shadow-dialog">
          <DialogTitle id="discard-title" className="m-0 text-lg font-bold">
            Discard session?
          </DialogTitle>
          <p className="mb-5 mt-3 text-[0.95rem] text-muted">
            Are you sure you want to discard this session? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="min-h-12 w-full cursor-pointer rounded-lg border-0 bg-panel text-[0.95rem] font-bold leading-none text-white"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="min-h-12 w-full cursor-pointer rounded-lg border-0 bg-danger text-[0.95rem] font-bold leading-none text-white"
              onClick={onConfirm}
            >
              Discard
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
