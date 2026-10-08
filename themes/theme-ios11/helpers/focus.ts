let keyboardUsed = false;

document.addEventListener('keydown', (event) => {
  if (!event.metaKey && !event.ctrlKey && !event.altKey) {
    keyboardUsed = true;
  }
}, true);

document.addEventListener('pointerdown', () => {
  keyboardUsed = false;
}, true);

/**
 * Moves the focus for screen readers. The focus indicator only shows when the visitor uses the
 * keyboard, not after a tap or a click.
 * @param element The element that takes the focus.
 */
export const focusElement = (element: HTMLElement) => {
  if (!keyboardUsed) {
    element.setAttribute('data-silent-focus', '');
    element.addEventListener('blur', () => {
      element.removeAttribute('data-silent-focus');
    }, { once: true });
  }

  element.focus();
};
