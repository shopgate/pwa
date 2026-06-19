/**
 * Checks whether the user has requested reduced motion.
 * @returns {boolean} True when `prefers-reduced-motion: reduce` matches.
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Computes the FLIP delta (translate + scale) needed to make an element that is
 * positioned at `toRect` appear as if it were positioned at `fromRect`.
 * @param {DOMRect|Object} fromRect The source rect (where the clone should appear to start).
 * @param {DOMRect|Object} toRect The target rect (where the clone is actually positioned).
 * @returns {{translateX: number, translateY: number, scaleX: number, scaleY: number}} The delta.
 */
export const getFlipDelta = (fromRect, toRect) => {
  const safeWidth = toRect.width || 1;
  const safeHeight = toRect.height || 1;

  return {
    translateX: fromRect.left - toRect.left,
    translateY: fromRect.top - toRect.top,
    scaleX: fromRect.width / safeWidth,
    scaleY: fromRect.height / safeHeight,
  };
};

/**
 * Serialises a FLIP delta into a CSS transform string.
 * @param {Object} delta The FLIP delta (translateX, translateY, scaleX, scaleY).
 * @returns {string} The CSS transform value.
 */
export const deltaToTransform = (delta) => {
  const {
    translateX, translateY, scaleX, scaleY,
  } = delta;

  return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
};
