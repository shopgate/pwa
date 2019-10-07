import noop from 'lodash/noop';

/**
 * @typedef {Object} FunctionHook
 * @property {Function} rewrite replace original function with hook
 * @property {Function} restore restore original function
 * @property {Function} use add hook
 * @property {Function} original original function
 */

/**
 * @param {Function} original original function
 * @returns {Function}
 */
export default (original) => {
  // eslint-disable-next-line no-underscore-dangle
  const _origin = original;
  let origin = original;

  const hooks = [];

  /**
   * Process hook stack
   * @param {*} args args
   * @returns {*}
   */
  function hook(...args) {
    return [...hooks, origin].reduce((acc, cb, i, arr) => {
      const res = cb(...acc);
      if (res === undefined) {
        // No return from hook. Stop a stack
        arr.splice(-(arr.length - i));
        // Return noop thunk (for redux dispatch)
        return noop;
      }

      if (origin === cb) {
        // Last hook, return original result
        return res;
      }

      // Return args for next hook
      return [res].concat([].slice.call(acc, 1));
    }, args);
  }

  // Replace original stack
  hook.rewrite = (cb) => {
    origin = cb;
  };
  // Restore original
  hook.restore = () => {
    origin = _origin;
  };

  // Extend hooks stack
  hook.use = cb => hooks.push(cb);

  // Expose original
  hook.original = _origin;

  return hook;
};
