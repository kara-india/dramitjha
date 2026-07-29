// src/lib/focusTrapHelper.ts
export function trapFocus(containerEl: HTMLElement, event: React.KeyboardEvent) {
  if (event.key !== "Tab") return;

  const focusables = containerEl.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
