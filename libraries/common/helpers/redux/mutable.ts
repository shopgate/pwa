import noop from 'lodash/noop';
import { isObject } from '../validation';

const BEFORE_ACTION_NEXT = 'next';
const BEFORE_ACTION_SKIP_REST = 'skipRest';
const BEFORE_ACTION_STOP = 'stop';

/**
 * What a `useBefore` step of a mutable function returns: `next`, `skipRest` or `stop` of
 * `mutableActions`, or nothing to keep the arguments.
 */
export type MutableStepResult = {
  /**
   * How the mutable function goes on.
   */
  action: 'next' | 'skipRest' | 'stop';
  /**
   * The arguments for the next step, or the result for `stop`.
   */
  args: unknown;
} | void;

/**
 * A function made mutable with `mutable`, e.g. many actions of the core. Extensions can replace
 * it or add steps that run before it.
 */
export interface MutableFunction<F extends (...args: never[]) => unknown> {
  /**
   * Calls the function. When a step called `stop()`, it returns a no-op function instead, which
   * redux can still dispatch.
   */
  (...args: Parameters<F>): ReturnType<F>;
  /**
   * The function as it was made mutable.
   */
  original: F;
  /**
   * The function that replaced the original one, if any.
   */
  current?: F;
  /**
   * Replaces the function. The steps added with `useBefore` still run before it.
   */
  replace(customFunc: F): void;
  /**
   * Restores the original function and keeps the steps.
   */
  restore(): void;
  /**
   * Restores the original function and removes the steps.
   */
  reset(): void;
  /**
   * Adds a step that runs before the function and can change its arguments or stop it.
   */
  useBefore(step: (...args: Parameters<F>) => MutableStepResult): void;
}

/**
 * Defines parameters to be used by the next step or mutable function.
 * @param args Transforms an argument list to be consumed by the next step or
 * @returns The step result.
 */
export function next<A extends unknown[]>(...args: A): { action: 'next'; args: A } {
  return {
    action: BEFORE_ACTION_NEXT,
    args,
  };
}

/**
 * Causes the stack to skip forward to processing the mutable using the given arguments.
 * @param args A number of arguments to be passed to the mutable. This is optional.
 * @returns The step result.
 */
export function skipRest<A extends unknown[]>(...args: A): { action: 'skipRest'; args: A } {
  return {
    action: BEFORE_ACTION_SKIP_REST,
    args,
  };
}

/**
 * Causes the stack to stop processing any further actions. On stop only one return value possible.
 * @param arg Optional final result value.
 * @returns The step result.
 */
export function stop<T = undefined>(arg?: T): { action: 'stop'; args: T | undefined } {
  return {
    action: BEFORE_ACTION_STOP,
    args: arg,
  };
}

/**
 * Public api export
 */
export const mutableActions = {
  next,
  skipRest,
  stop,
};

/**
 * Any function, as `mutable` handles it internally.
 */
type AnyFunction = (...args: never[]) => unknown;

/**
 * A function without known parameters, e.g. a value of the type `Function`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UntypedFunction = (...args: any[]) => any;

/**
 * The mutable version of a function. Values without a call signature become untyped functions.
 */
type MutableOf<F> = F extends AnyFunction ? MutableFunction<F> : MutableFunction<UntypedFunction>;

/**
 * Takes a function and makes it mutable.
 * @param func Original function to convert to a mutable
 * @returns The mutable function.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const mutable = <F extends Function>(func: F): MutableOf<F> => {
  const original = func as unknown as AnyFunction;
  let current = original;

  const steps: ((...args: never[]) => MutableStepResult)[] = [];

  /**
   * Takes the pre-processing steps and calls all step functions, as well as the mutable function
   * afterwards. Each step can transform the arguments, that are passed in to the next step in the
   * stack and ultimately to the mutable function.
   * @param args Arguments passed down to the mutable and its pre-processor actions.
   * @returns A function to be consumed by redux
   */
  const mutableFunc = function mutableFunc(...args: never[]) {
    let mutatedArgs: unknown = args;
    let runAction = true;

    // Execute pre-processing steps, if any available.
    if (steps.length > 0) {
      mutatedArgs = steps.slice().reduce<unknown>((acc, step, i, arr) => {
        // Call next step func in the pipeline with mutated args
        let res: unknown = step(...(acc as never[]));

        // Keep params unchanged if the step did not perform any change action at all
        if (!isObject(res)) {
          return acc;
        }

        /**
         * Checks whether the current result is a step result with the given action.
         * @param action The action.
         * @returns Whether it is.
         */
        const isAction = (action: string) => (res as { action?: unknown }).action === action;

        /**
         * Reads the arguments of the current step result.
         * @returns The arguments.
         */
        const getArgs = () => (res as { args?: { length: number } }).args;

        // Unpack arguments from the "useBefore" pre-processor with "next" action.
        if (isAction(BEFORE_ACTION_NEXT)) {
          const stepArgs = getArgs();
          if (stepArgs && stepArgs.length > 0) {
            res = stepArgs;
          } else {
            res = args;
          }
        }

        // Unpack arguments from the "useBefore" pre-processor with "skipRest" action.
        if (isAction(BEFORE_ACTION_SKIP_REST)) {
          arr.splice(-(arr.length - i));

          const stepArgs = getArgs();
          if (stepArgs && stepArgs.length > 0) {
            res = stepArgs;
          } else {
            res = args;
          }
        }

        // Check if the step requested to stop any further processing including the action itself
        if (isAction(BEFORE_ACTION_STOP)) {
          // Cut off all following step functions including the mutable func
          arr.splice(-(arr.length - i));

          runAction = false;
          res = getArgs();
        }

        // Replace arguments for the next step to get.
        return res;
      }, args);
    }

    if (!runAction) {
      // the return value here gets passed to the dispatch() so it must be a function or action obj
      return noop;
    }

    // Call the actual mutable
    return current(...(mutatedArgs as never[]));
  } as MutableFunction<AnyFunction>;

  /**
   * Replaces the original functionality with a custom function.
   * @param customFunc The function to execute instead of the original one.
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
   * @param stepFunc The function to be executed before
   */
  mutableFunc.useBefore = (stepFunc) => { steps.push(stepFunc); };

  // Allow access to the original function.
  mutableFunc.original = original;

  return mutableFunc as unknown as MutableOf<F>;
};
