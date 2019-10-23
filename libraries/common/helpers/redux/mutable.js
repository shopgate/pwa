import { isObject } from '../validation';

/**
 * @typedef {Object} MutableFunction
 * @property {Function} replace Replaces the original functionality with a custom function.
 * @property {Function} restore Restores the original function.
 * @property {Function} reset Restores the original function and removes all pre-processes steps.
 * @property {Function} addPreprocessStep Adds a pre-processing step func.
 * @property {Function} original Original function
 */

const BEFORE_ACTION_NEXT = 'next';
const BEFORE_ACTION_SKIP_REST = 'skipRest';
const BEFORE_ACTION_STOP = 'stop';

/**
 * Defines parameters to be used by the next step or mutable function.
 * @param {*} args Transforms an argument list to be consumed by the next step or
 * @returns {Object}
 */
export function next(...args) {
  return {
    action: BEFORE_ACTION_NEXT,
    args,
  };
}

/**
 * Causes the stack to skip forward to processing the mutable using the given arguments.
 * @param {*} [args] A number of arguments to be passed to the mutable. This is optional.
 * @returns {Object}
 */
export function skipRest(...args) {
  return {
    action: BEFORE_ACTION_SKIP_REST,
    args,
  };
}

/**
 * Causes the stack to stop processing any further actions. On stop only one return value possible.
 * @param {*} [arg] Optional final result value.
 * @returns {Object}
 */
export function stop(arg) {
  return {
    action: BEFORE_ACTION_STOP,
    args: arg,
  };
}

/**
 * Takes a function and makes it mutable.
 * @param {Function} func Original function to convert to a mutable
 * @returns {Function}
 */
export const mutable = (func) => {
  const original = func;
  let current = func;

  const steps = [];

  /**
   * Takes the pre-processing steps and calls all step functions, as well as the mutable function
   * afterwards. Each step can transform the arguments, that are passed in to the next step in the
   * stack and ultimately to the mutable function.
   * @param {*} args Arguments passed down to the mutable and its pre-processor actions.
   * @returns {Function} A function to be consumed by redux
   */
  function mutableFunc(...args) {
    let mutatedArgs = args;
    let runAction = true;

    // Execute pre-processing steps, if any available.
    if (steps.length > 0) {
      mutatedArgs = steps.reduce((acc, step, i, arr) => {
        // Call next step func in the pipeline with mutated args
        let res = step(...acc);

        // Keep params unchanged if the step did not perform any change action at all
        if (!isObject(res)) {
          return acc;
        }

        // Unpack arguments from the "useBefore" pre-processor with "next" action.
        if (res.action === BEFORE_ACTION_NEXT) {
          if (res.args && res.args.length > 0) {
            res = res.args;
          } else {
            res = args;
          }
        }

        // Unpack arguments from the "useBefore" pre-processor with "skipRest" action.
        if (res.action === BEFORE_ACTION_SKIP_REST) {
          arr.splice(-(arr.length - i));

          if (res.args && res.args.length > 0) {
            res = res.args;
          } else {
            res = args;
          }
        }

        // Check if the step requested to stop any further processing including the action itself
        if (res.action === BEFORE_ACTION_STOP) {
          // Cut off all following step functions including the mutable func
          arr.splice(-(arr.length - i));

          runAction = false;
          res = res.args;
        }

        // Replace arguments for the next step to get.
        return res;
      }, args);
    }

    if (!runAction) {
      return mutatedArgs;
    }

    // Call the actual mutable
    return current(...mutatedArgs);
  }

  /**
   * Replaces the original functionality with a custom function.
   * @param {Function} customFunc The function to execute instead of the original one.
   */
  mutableFunc.replace = (customFunc) => {
    current = customFunc;

    // Allow access to the current mutation.
    mutableFunc.current = current;
  };

  /**
   * Restores the original func, while keeping additional functions to be called beforehand.
   */
  mutableFunc.restore = () => {
    current = original;
  };

  /**
   * Resets the whole mutable to its initial state, restoring the original functionality and
   * dropping all injected functions.
   */
  mutableFunc.reset = () => {
    current = original;
    steps.length = 0;
  };

  /**
   * Adds a pre-processing step func to a list to be called before the actual functionality
   * executes. Each step can modify the arguments, passed down to the next step or the mutable.
   * @param {Function} stepFunc The function to be executed before
   */
  mutableFunc.useBefore = (stepFunc) => { steps.push(stepFunc); };

  // Allow access to the original function.
  mutableFunc.original = original;

  return mutableFunc;
};
