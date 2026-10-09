const DURATION = 280;
const EASING = 'cubic-bezier(0.2, 0, 0, 1)';
const SETTLE_TIMEOUT = 120;

/**
 * Checks the motion preference of the visitor.
 * @returns Whether the visitor asked for less motion.
 */
export const prefersReducedMotion = () => (
  typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

const run = (
  element: HTMLElement | null | undefined,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions = {}
): Promise<unknown> => {
  if (!element || typeof element.animate !== 'function' || prefersReducedMotion()) {
    return Promise.resolve();
  }

  const timing = {
    duration: DURATION,
    easing: EASING,
    fill: 'backwards' as FillMode,
    ...options,
  };

  return Promise.race([
    element.animate(keyframes, timing).finished.catch(() => null),
    new Promise((resolve) => {
      setTimeout(resolve, Number(timing.duration) + SETTLE_TIMEOUT);
    }),
  ]);
};

/**
 * Drops the running transitions of elements, so a finished one cannot cover the next.
 * @param elements The elements to reset.
 */
export const cancelAnimations = (...elements: (HTMLElement | null | undefined)[]) => {
  elements.forEach((element) => {
    if (element && typeof element.getAnimations === 'function') {
      element.getAnimations().forEach(animation => animation.cancel());
    }
  });
};

/**
 * Moves the panel while the visitor drags it towards the edge.
 * @param panel The panel of the drawer.
 * @param backdrop The backdrop of the drawer.
 * @param offset The horizontal offset in pixels, zero or negative. Null releases the panel.
 */
export const setDragOffset = (
  panel: HTMLElement | null,
  backdrop: HTMLElement | null,
  offset: number | null
) => {
  if (!panel || !backdrop) {
    return;
  }

  if (offset === null) {
    panel.style.removeProperty('transform');
    backdrop.style.removeProperty('opacity');
    return;
  }

  panel.style.setProperty('transform', `translateX(${offset}px)`);
  backdrop.style.setProperty('opacity', String(Math.max(0, 1 + (offset / panel.offsetWidth))));
};

/**
 * Slides the panel in from the edge, or back in place after a drag that did not close it.
 * @param panel The panel of the drawer.
 * @param backdrop The backdrop of the drawer.
 * @param offset The offset in pixels the panel starts from. Without it the panel starts outside.
 * @returns Resolves when the transition finished.
 */
export const animateOpen = (
  panel: HTMLElement | null,
  backdrop: HTMLElement | null,
  offset?: number
) => {
  const width = panel?.offsetWidth || 1;
  const start = typeof offset === 'number' ? offset : -width;
  setDragOffset(panel, backdrop, null);

  return Promise.all([
    run(panel, [{ transform: `translateX(${start}px)` }, { transform: 'none' }]),
    run(backdrop, [{ opacity: 1 + (start / width) }, { opacity: 1 }]),
  ]);
};

/**
 * Slides the panel out to the edge.
 * @param panel The panel of the drawer.
 * @param backdrop The backdrop of the drawer.
 * @param offset The offset in pixels the panel starts from.
 * @returns Resolves when the transition finished.
 */
export const animateClose = (
  panel: HTMLElement | null,
  backdrop: HTMLElement | null,
  offset = 0
) => {
  const width = panel?.offsetWidth || 1;
  const options: KeyframeAnimationOptions = {
    fill: 'both',
    duration: DURATION * Math.max(0.4, 1 + (offset / width)),
  };

  return Promise.all([
    run(panel, [{ transform: `translateX(${offset}px)` }, { transform: 'translateX(-100%)' }], options),
    run(backdrop, [{ opacity: 1 + (offset / width) }, { opacity: 0 }], options),
  ]);
};

/**
 * Moves from one level to the next: deeper levels come in from the right, the way back from the
 * left.
 * @param entering The level that becomes visible.
 * @param leaving The level that was visible.
 * @param direction 1 for a deeper level, -1 for the way back.
 * @returns Resolves when the transition finished.
 */
export const animateLevels = (
  entering: HTMLElement | null,
  leaving: HTMLElement | null,
  direction: 1 | -1
) => Promise.all([
  run(entering, [
    {
      transform: `translateX(${direction * 100}%)`,
    },
    { transform: 'none' },
  ]),
  run(leaving, [
    {
      transform: 'none',
      opacity: 1,
    },
    {
      transform: `translateX(${direction * -30}%)`,
      opacity: 0,
    },
  ], { fill: 'both' }),
]);
