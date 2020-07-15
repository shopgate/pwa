import { main$ } from '@shopgate/pwa-common/streams';
import { SELECT_GLOBAL_LOCATION } from '../constants';

export const preferredLocationDidUpdate$ = main$
  .filter(({ action }) => action.type === SELECT_GLOBAL_LOCATION);
