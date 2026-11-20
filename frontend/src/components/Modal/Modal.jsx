import { useEffect, useId, useRef } from "react";
export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) {
  const label = useId(),
    panel = useRef(null),
    close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const node = panel.current;
    const focusable = () =>
      [
        ...node.querySelectorAll(
          'button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex="0"]',
        ),
      ].filter((x) => x.getClientRects().length);
    (focusable()[0] || node).focus();
    const key = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close.current?.();
      }
      if (e.key === "Tab") {
        const list = focusable(),
          first = list[0],
          last = list.at(-1);
        if (!first) {
          e.preventDefault();
          node.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open]);
  if (!open) return null;
  return (
    <div
      role="presentation"
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: "rgba(22,33,62,.45)", zIndex: 1080 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <section
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={label}
        tabIndex={-1}
        className="v-card w-100"
        style={{
          maxWidth: size === "lg" ? 720 : size === "sm" ? 380 : 540,
          maxHeight: "90dvh",
          overflowY: "auto",
        }}
      >
        <div className="d-flex align-items-center justify-content-between px-4 pt-3 pb-2">
          <h2 id={label} className="h5 mb-0">
            {title}
          </h2>
          <button className="btn-close" aria-label="Close" onClick={onClose} />
        </div>
        <div className="px-4 py-3">{children}</div>
        {footer && (
          <div className="px-4 py-3 border-top d-flex justify-content-end gap-2">
            {footer}
          </div>
        )}
      </section>
    </div>
  );
}
