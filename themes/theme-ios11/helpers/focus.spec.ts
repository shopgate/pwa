import { focusElement } from './focus';

/**
 * Creates a focusable button in the document.
 * @param label The label of the button.
 * @returns The button.
 */
const createButton = (label: string) => {
  const button = document.createElement('button');
  button.textContent = label;
  document.body.appendChild(button);
  return button;
};

/**
 * Fires the blur event the browser sends when the app or the window goes to the background.
 * The element stays the active element.
 * @param element The focused element.
 */
const blurWindow = (element: HTMLElement) => {
  element.dispatchEvent(new FocusEvent('blur'));
};

describe('focusElement', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('focuses the element silently after a tap', () => {
    const button = createButton('back');
    document.dispatchEvent(new Event('pointerdown'));

    focusElement(button);

    expect(document.activeElement).toBe(button);
    expect(button.hasAttribute('data-silent-focus')).toBe(true);
  });

  it('keeps the focus silent when the app goes to the background and comes back', () => {
    const button = createButton('back');
    document.dispatchEvent(new Event('pointerdown'));
    focusElement(button);

    blurWindow(button);
    blurWindow(button);

    expect(document.activeElement).toBe(button);
    expect(button.hasAttribute('data-silent-focus')).toBe(true);
  });

  it('removes the silent focus once the focus moves to another element', () => {
    const button = createButton('back');
    const other = createButton('other');
    document.dispatchEvent(new Event('pointerdown'));
    focusElement(button);
    blurWindow(button);

    other.focus();

    expect(button.hasAttribute('data-silent-focus')).toBe(false);
  });

  it('shows the focus after keyboard navigation', () => {
    const button = createButton('back');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

    focusElement(button);

    expect(button.hasAttribute('data-silent-focus')).toBe(false);
  });
});
