import { toast } from "sonner"

type ToastConfirmOptions = {
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
}

export function confirmWithToast({
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
}: ToastConfirmOptions): void {
  toast(message, {
    action: {
      label: confirmLabel,
      onClick: () => {
        void onConfirm()
      },
    },
    cancel: {
      label: cancelLabel,
      onClick: () => {},
    },
  })
}
