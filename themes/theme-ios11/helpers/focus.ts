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
 * Keeps the focus indicator of an element hidden until the focus moves to another element.
 * When the app or the browser window goes to the background, the element also gets a blur event
 * but stays the active element. It gets the focus back on return, so it stays silent.
 * @param element The element with the silent focus.
 */
const keepSilentUntilFocusMoves = (element: HTMLElement) => {
  element.addEventListener('blur', () => {
    if (document.activeElement === element) {
      keepSilentUntilFocusMoves(element);
      return;
    }

    element.removeAttribute('data-silent-focus');
  }, { once: true });
};

/**
 * Moves the focus for screen readers. The focus indicator only shows when the visitor uses the
 * keyboard, not after a tap or a click.
 * @param element The element that takes the focus.
 */
export const focusElement = (element: HTMLElement) => {
  if (keyboardUsed) {
    element.removeAttribute('data-silent-focus');
  } else if (!element.hasAttribute('data-silent-focus')) {
    element.setAttribute('data-silent-focus', '');
    keepSilentUntilFocusMoves(element);
  }

  element.focus();
};
