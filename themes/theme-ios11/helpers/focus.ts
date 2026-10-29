const NAVIGATION_KEYS = ['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
let keyboardUsed = false;

// Typing into a field is no keyboard navigation: on a phone the on-screen keyboard sends key
// events too.
document.addEventListener('keydown', (event) => {
  if (NAVIGATION_KEYS.includes(event.key)) {
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
