import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  tone = 'danger',
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <div className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center ${tone === 'danger' ? 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]' : 'bg-[var(--color-amber-soft)] text-[var(--color-amber-dark)]'}`}>
          <AlertTriangle size={18} />
        </div>
        <p className="text-sm text-[var(--color-ink-soft)] pt-1.5">{description}</p>
      </div>
    </Modal>
  );
}
