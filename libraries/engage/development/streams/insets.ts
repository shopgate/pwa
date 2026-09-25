import { main$ } from '@shopgate/engage/core/streams';
import { DEVELOPMENT_TOOLS_TOGGLE_INSETS } from '../constants';
import type { DevelopmentSettingsAction } from '../action-creators/settings';

/**
 * Gets triggered after the simulated page insets were updated.
 */
export const simulatedPageInsetsDidUpdate$ = main$
  .filter(({ action }: { action: DevelopmentSettingsAction }) =>
    action.type === DEVELOPMENT_TOOLS_TOGGLE_INSETS);
