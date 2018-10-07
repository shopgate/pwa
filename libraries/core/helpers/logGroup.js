import { logger } from './index';

const KEY_COLOR = 'gray';

/**
 * Repeates a string by a defined amount of times.
 * @param {string} str The string to repeat.
 * @param {number} times How many times the string should be repeated.
 * @return {string}
 */
const repeat = (str, times) =>
  (new Array(times + 1)).join(str);

/**
 * Creates a string from a number and fills up the gap with 0 to reach a certain length.
 * @param {number} num The number
 * @param {number} maxLength The length of the resulting string.
 * @return {string}
 */
const pad = (num, maxLength) =>
  repeat('0', maxLength - num.toString().length) + num;

/**
 * Formats a timestamp for the output in the group title.
 * @param {number} time The timestamp to format.
 * @return {string}
 */
const formatTime = () => {
  const time = new Date();

  return `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;
};

/**
 * Creates the style for a console string portion.
 * @param {string} [color='gray'] The text color.
 * @param {string} [fontWeight='lighter'] The front weight.
 * @return {string}
 */
const style = (color = 'gray', fontWeight = 'lighter') =>
  `color: ${color}; font-weight: ${fontWeight};`;

/**
 * Returns the biggest length value of an object's keys.
 * @param {Object} prop The object to walk through.
 * @return {number}
 */
const maxKeysLength = (prop) => {
  let maxLength = 0;

  Object.keys(prop).forEach((key) => {
    if ((key.length + 1) > maxLength) {
      maxLength = key.length + 1;
    }
  });

  return maxLength;
};

/**
 * Logs a group of console logs.
 * @param {string} title The group title.
 * @param {Object} [content={}] The content of the group.
 * @param {string} [actionColor='gray'] The action color.
 */
const logGroup = (title, content = {}, actionColor = 'gray') => {
  const time = formatTime();

  logger.groupCollapsed(
    ` %c${title} %c@ ${time}`,
    style(actionColor),
    style('bold'),
    style()
  );

  if (Object.keys(content).length) {
    const maxLength = maxKeysLength(content) + 2;

    Object.keys(content).forEach((key) => {
      const value = content[key];
      const action = (`${key}:`).padEnd(maxLength);

      // If the content is an object, log all keys individually.
      if (typeof value === 'object' && value !== null && value.constructor === Object) {
        if (!Object.keys(value).length) {
          logger.log(` %c ${action}`, style(KEY_COLOR, 'bold'), 'undefined');
        } else logger.log(` %c ${action}`, style(KEY_COLOR, 'bold'), value);
      } else logger.log(` %c ${action}`, style(KEY_COLOR, 'bold'), value);
    });
  }

  logger.groupEnd();
};

export default logGroup;
