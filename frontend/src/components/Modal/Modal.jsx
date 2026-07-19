import { useEffect } from 'react';

/**
 * Modal — a lightweight controlled dialog (no Bootstrap JS dependency, so it
 * plays nicely with React state). Renders a backdrop + centered panel when
 * `open` is true; calls `onClose` on backdrop click, close button, or Escape.
 */
export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxWidth = size === 'lg' ? 720 : size === 'sm' ? 380 : 540;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: 'rgba(22,33,62,.45)', zIndex: 1080 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      role="dialog"
      aria-modal="true"
    >
      <div className="v-card w-100" style={{ maxWidth }}>
        <div className="d-flex align-items-center justify-content-between px-4 pt-3 pb-2">
          <h5 className="mb-0">{title}</h5>
          <button className="btn-close" aria-label="Close" onClick={onClose} />
        </div>
        <div className="px-4 py-3">{children}</div>
        {footer && (
          <div className="px-4 py-3 border-top d-flex justify-content-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
}
