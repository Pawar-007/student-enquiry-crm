import { createContext, useCallback, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export const ToastContext = createContext(null);

let idCounter = 0;

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const TONE_STYLES = {
  success: 'border-l-4 border-[var(--color-success)]',
  error: 'border-l-4 border-[var(--color-danger)]',
  info: 'border-l-4 border-[var(--color-cobalt)]',
};

const ICON_COLOR = {
  success: 'text-[var(--color-success)]',
  error: 'text-[var(--color-danger)]',
  info: 'text-[var(--color-cobalt)]',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = 'success') => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, tone }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      success: (msg) => push(msg, 'success'),
      error: (msg) => push(msg, 'error'),
      info: (msg) => push(msg, 'info'),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <div
              key={t.id}
              role="status"
              className={`bg-[var(--color-surface)] shadow-lg rounded-[var(--radius-md)] px-4 py-3 flex items-start gap-3 ${TONE_STYLES[t.tone]}`}
            >
              <Icon size={18} className={`shrink-0 mt-0.5 ${ICON_COLOR[t.tone]}`} />
              <p className="text-sm text-[var(--color-ink)] flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
