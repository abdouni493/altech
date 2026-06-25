import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./button";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      position="top"
      title={t("common.confirm")}
    >
      <div className="flex items-start gap-4">
        <span className="grid place-items-center h-11 w-11 rounded-xl bg-moo-rose/15 text-moo-rose shrink-0">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <p className="text-sm text-moo-ink pt-2">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {t("common.delete")}
        </Button>
      </div>
    </Modal>
  );
}
