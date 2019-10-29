/**
 * The linear easing callback.
 * @param {number} relativeValue The relative value between [0...1].
 * @param {number} resolution The resolution, must be a value between [0,1...1].
 * @returns {number} The interpolated value.
 */
const easeLinear = (relativeValue, resolution) => {
  const inverseResolution = (1.0 / resolution);

  return (relativeValue * inverseResolution) / inverseResolution;
};

/**
 * Generates a linear easing callback.
 * @param {number} resolution The discrete step size.
 * @returns {Function} The generated callback.
 */
export const generateLinearEasingCallback = (resolution = 0.1) => (
  relativeValue => easeLinear(relativeValue, resolution)
);

/**
 * The exponential easing callback.
 * @param {number} relativeValue The relative value between [0...1].
 * @param {number} factor The exponential scale factor.
 * @returns {number} The interpolated value.
 */
const easeExponential = (relativeValue, factor) => (
  relativeValue ** factor
);

/**
 * Generates an exponential easing callback.
 * @param {number} factor The exponential scale factor.
 * @returns {Function} The generated callback.
 */
export const generateExponentialEasingCallback = (factor = 2.5) => (
  relativeValue => easeExponential(relativeValue, factor)
);

/**
 * Converts a range of [0...1] into a style object.
 * @param {number} min A value in interval [0...1]
 * @param {number} max A value in interval [0...1]
 * @param {number} transitionDuration The duration of the transition.
 * @returns {Object} The generated style object
 */
export const getRangeStyle = (min, max, transitionDuration) => ({
  left: `${Math.min(1, Math.max(0, min)) * 100}%`,
  right: `${(1 - Math.min(1, Math.max(0, max))) * 100}%`,
  transition: transitionDuration > 0 ? `left ${transitionDuration}ms, right ${transitionDuration}ms` : null,
});

/**
 * Shortcut for retrieving x position of a touch event.
 * @param {TouchEvent} event The TouchEvent
 * @returns {number} The x position
 */
export const getTouchPositionX = event => event.touches[0].pageX;

/**
 * Converts a relative slider value into an absolute value.
 * A relative value is a value between [0...1] indicating the position
 * on the slider given its absolute width.
 * An absolute value is a value in screen space coordinates. This value must be
 * between [0...offsetWidth] of the range slider.
 * @param {number} value The actual value.
 * @param {number} min The minimum.
 * @param {number} max The maximum.
 * @param {boolean} allowRealValues Whether the value should be rounded to the nearest integer.
 * @returns {number} The converted absolute value.
 */
export const getAbsoluteValue = (value, min, max, allowRealValues = false) => {
  const result = min + ((max - min) * value);

  return Math.min(max, Math.max(min, allowRealValues ? result : Math.round(result)));
};

/**
 * Converts an absolute slider value into a relative value.
 * An absolute value is a value in screen space coordinates. This value must be
 * between [0...offsetWidth] of the price range slider.
 * A relative value is a value between [0...1] indicating the position
 * on the slider given its absolute width.
 * @param {number} value The actual value.
 * @param {number} min The minimum.
 * @param {number} max The maximum.
 * @returns {number} The converted relative value.
 */
export const getRelativeValue = (value, min, max) => {
  const result = ((value - min) / (max - min));

  return Math.min(1, Math.max(0, result));
};
