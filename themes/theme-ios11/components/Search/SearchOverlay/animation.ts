const DURATION = 280;
const EASING = 'cubic-bezier(0.2, 0, 0, 1)';

/**
 * The elements of the search overlay that take part in the transition.
 */
export interface OverlayElements {
  backdrop?: HTMLElement | null;
  headerBackground?: HTMLElement | null;
  field?: HTMLElement | null;
  cancel?: HTMLElement | null;
  body?: HTMLElement | null;
}

/**
 * Checks the motion preference of the visitor.
 * @returns Whether the visitor asked for less motion.
 */
const prefersReducedMotion = () => (
  typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

/**
 * Runs an animation on an element.
 * @param element The element to animate.
 * @param keyframes The keyframes.
 * @param options Additional animation options.
 * @returns Resolves when the animation finished.
 */
const run = (
  element: HTMLElement | null | undefined,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions = {}
): Promise<unknown> => {
  if (!element || typeof element.animate !== 'function') {
    return Promise.resolve();
  }

  return element.animate(keyframes, {
    duration: DURATION,
    easing: EASING,
    fill: 'both',
    ...options,
  }).finished.catch(() => null);
};

/**
 * Keyframes that move the overlay field from the field that opened it.
 * @param field The field of the overlay.
 * @param origin The field that opened the overlay.
 * @returns The keyframes.
 */
const getFieldKeyframes = (field: HTMLElement, origin?: HTMLElement | null): Keyframe[] => {
  const target = field.getBoundingClientRect();
  const source = origin?.isConnected ? origin.getBoundingClientRect() : null;

  if (!source || !source.width) {
    return [
      {
        transform: 'translateY(-12px)',
        opacity: 0,
      },
      {
        transform: 'none',
        opacity: 1,
      },
    ];
  }

  return [
    {
      transform: `translate(${source.left - target.left}px, ${source.top - target.top}px)`,
      width: `${source.width}px`,
      flexShrink: 0,
      flexGrow: 0,
    },
    {
      transform: 'none',
      width: `${target.width}px`,
      flexShrink: 0,
      flexGrow: 0,
    },
  ];
};

const FADE_IN: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];
const SLIDE_IN: Keyframe[] = [
  {
    transform: 'translateX(100%)',
    opacity: 0,
  },
  {
    transform: 'none',
    opacity: 1,
  },
];

/**
 * Hides the field that opened the overlay while the overlay covers it.
 * @param origin The field that opened the overlay.
 * @param hidden Whether to hide it.
 */
export const setOriginHidden = (origin: HTMLElement | null | undefined, hidden: boolean) => {
  if (!origin) {
    return;
  }

  if (hidden) {
    origin.style.setProperty('visibility', 'hidden');
  } else {
    origin.style.removeProperty('visibility');
  }
};

/**
 * Lets the search overlay grow out of the field that opened it.
 * @param elements The elements of the overlay.
 * @param origin The field that opened the overlay.
 * @returns Resolves when the transition finished.
 */
export const animateOpen = (elements: OverlayElements, origin?: HTMLElement | null) => {
  const {
    backdrop, headerBackground, field, cancel, body,
  } = elements;

  if (prefersReducedMotion() || !field) {
    return Promise.resolve();
  }

  const fieldFrames = getFieldKeyframes(field, origin);
  setOriginHidden(origin, true);
  const release: KeyframeAnimationOptions = { fill: 'backwards' };

  return Promise.all([
    run(backdrop, FADE_IN, release),
    run(headerBackground, FADE_IN, release),
    run(field, fieldFrames, release),
    run(cancel, SLIDE_IN, release),
    run(body, FADE_IN, {
      ...release,
      delay: DURATION / 3,
    }),
  ]);
};

/**
 * Moves the search overlay back into the field that opened it.
 * @param elements The elements of the overlay.
 * @param origin The field that opened the overlay.
 * @returns Resolves when the transition finished.
 */
export const animateClose = (elements: OverlayElements, origin?: HTMLElement | null) => {
  const {
    backdrop, headerBackground, field, cancel, body,
  } = elements;

  if (prefersReducedMotion() || !field) {
    return Promise.resolve();
  }

  const reverse: KeyframeAnimationOptions = { direction: 'reverse' };
  const fast: KeyframeAnimationOptions = {
    ...reverse,
    duration: DURATION / 2,
  };

  return Promise.all([
    run(body, FADE_IN, fast),
    run(cancel, SLIDE_IN, reverse),
    run(field, getFieldKeyframes(field, origin), reverse),
    run(headerBackground, FADE_IN, reverse),
    run(backdrop, FADE_IN, reverse),
  ]);
};
