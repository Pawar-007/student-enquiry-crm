import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function Drawer({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[var(--color-ink)]/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full sm:max-w-md h-full bg-[var(--color-surface)] shadow-xl flex flex-col animate-[slideIn_0.2s_ease]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="font-display text-lg text-[var(--color-ink)]">{title}</h2>
          <button onClick={onClose} aria-label="Close panel" className="text-[var(--color-muted)] hover:text-[var(--color-ink)] p-1 rounded-full hover:bg-[var(--color-border-soft)]">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-[var(--color-border)] flex justify-end gap-3">{footer}</div>}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>,
    document.body
  );
}
