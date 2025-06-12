import { isDev } from '@shopgate/engage/core/helpers';

const spacingUnit = 8;

/**
 * Create the spacing function of the theme
 * @returns {function(...(number | string)): string} A function that takes one or more spacing
 * arguments
 */
const createSpacing = () => {
  /**
   *
   * @param {number|string} input The input
   * @returns {string|number} The result
   */
  const transform = (input) => {
    if (typeof input === 'number') {
      return input * spacingUnit;
    }

    return input;
  };

  /**
   * @param {...(number | string)} args - One ore more spacing arguments, which can be numbers
   * or strings like 'auto',
   * @returns {string} A space-separated string of pixel values or other transformed values
   */
  const spacing = (...args) => {
    if (isDev) {
      if (!(args.length <= 4)) {
        // eslint-disable-next-line no-console
        console.error(`Too many arguments passed. Expected between 0 and 4 arguments, got ${args.length}.`);
      }
    }

    if (args.length === 0) {
      return transform(1);
    }

    if (args.length === 1) {
      return transform(args[0]);
    }

    return args
      .slice(0, 4)
      .map((argument) => {
        const output = transform(argument);
        return typeof output === 'number' ? `${output}px` : output;
      })
      .join(' ');
  };

  return spacing;
};

export default createSpacing;
