import { main$ } from '@shopgate/engage/core/streams';
import { DEVELOPMENT_TOOLS_TOGGLE_INSETS } from '../constants';

/**
 * Gets triggered after the simulated page insets were updated
 * @type {Observable}
 */
export const simulatedPageInsetsDidUpdate$ = main$
  .filter(({ action }) => action.type === DEVELOPMENT_TOOLS_TOGGLE_INSETS);
