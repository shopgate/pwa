export const supportsInert = typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype;

/**
 * Takes the app below an overlay out of reach of keyboard and screen readers.
 * @param inert Whether the app is out of reach.
 */
export const setAppInert = (inert: boolean) => {
  const root = document.getElementById('root');

  if (supportsInert) {
    root?.toggleAttribute('inert', inert);
  } else if (inert) {
    root?.setAttribute('aria-hidden', 'true');
  } else {
    root?.removeAttribute('aria-hidden');
  }
};
