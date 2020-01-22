import {
  push, pop, replace, reset, update,
} from '../router/helpers';

/**
 * Provides functions for navigation.
 * @returns {Object}
 */
export function useNavigation() {
  return {
    push,
    pop,
    replace,
    reset,
    update,
  };
}
