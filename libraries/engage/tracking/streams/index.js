import { main$ } from '@shopgate/pwa-common/streams';
import { INITIALIZE_TRACKING } from '../constants';

export const initializeTracking$ = main$
  .filter(({ action }) => action.type === INITIALIZE_TRACKING);
