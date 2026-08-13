import {
  push, pop, replace, reset, update,
} from '../router/helpers';

export interface Navigation {
  push: typeof push;
  pop: typeof pop;
  replace: typeof replace;
  reset: typeof reset;
  update: typeof update;
}

/**
 * Provides functions for navigation.
 * @returns The navigation functions.
 */
export function useNavigation(): Navigation {
  return {
    push,
    pop,
    replace,
    reset,
    update,
  };
}
