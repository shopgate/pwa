const DURATION = 280;
const EASING = 'cubic-bezier(0.2, 0, 0, 1)';

/**
 * @returns {boolean} Whether the visitor asked for less motion.
 */
const prefersReducedMotion = () => (
  typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

/**
 * @param {Element} element The element to animate.
 * @param {Keyframe[]} keyframes The keyframes.
 * @param {Object} options Additional animation options.
 * @returns {Promise} Resolves when the animation finished.
 */
const run = (element, keyframes, options = {}) => {
  if (!element || typeof element.animate !== 'function') {
    return Promise.resolve();
  }

  const animation = element.animate(keyframes, {
    duration: DURATION,
    easing: EASING,
    fill: 'both',
    ...options,
  });

  return animation.finished.catch(() => null);
};

/**
 * Keyframes that move the overlay field from the position of the field that opened it.
 * @param {Element} field The field of the overlay.
 * @param {DOMRect|null} origin The position of the field that opened the overlay.
 * @returns {Keyframe[]}
 */
const getFieldKeyframes = (field, origin) => {
  const target = field.getBoundingClientRect();

  if (!origin) {
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
      transform: `translate(${origin.left - target.left}px, ${origin.top - target.top}px)`,
      width: `${origin.width}px`,
      flexGrow: 0,
    },
    {
      transform: 'none',
      width: `${target.width}px`,
      flexGrow: 0,
    },
  ];
};

const FADE_IN = [{ opacity: 0 }, { opacity: 1 }];

/**
 * Lets the search overlay grow out of the field that opened it.
 * @param {Object} elements The elements of the overlay.
 * @param {DOMRect|null} origin The position of the field that opened the overlay.
 * @returns {Promise}
 */
export const animateOpen = ({
  backdrop, field, cancel, body,
}, origin) => {
  if (prefersReducedMotion() || !field) {
    return Promise.resolve();
  }

  const releaseAfterwards = { fill: 'backwards' };

  return Promise.all([
    run(backdrop, FADE_IN, releaseAfterwards),
    run(field, getFieldKeyframes(field, origin), releaseAfterwards),
    run(cancel, FADE_IN, {
      ...releaseAfterwards,
      delay: DURATION / 2,
    }),
    run(body, FADE_IN, {
      ...releaseAfterwards,
      delay: DURATION / 3,
    }),
  ]);
};

/**
 * Moves the search overlay back into the field that opened it.
 * @param {Object} elements The elements of the overlay.
 * @param {DOMRect|null} origin The position of the field that opened the overlay.
 * @returns {Promise}
 */
export const animateClose = ({
  backdrop, field, cancel, body,
}, origin) => {
  if (prefersReducedMotion() || !field) {
    return Promise.resolve();
  }

  const fieldFrames = getFieldKeyframes(field, origin);
  const reverse = { direction: 'reverse' };

  return Promise.all([
    run(body, FADE_IN, {
      ...reverse,
      duration: DURATION / 2,
    }),
    run(cancel, FADE_IN, {
      ...reverse,
      duration: DURATION / 2,
    }),
    run(field, fieldFrames, reverse),
    run(backdrop, FADE_IN, reverse),
  ]);
};
