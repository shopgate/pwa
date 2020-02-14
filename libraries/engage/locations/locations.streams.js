import { main$ } from '@shopgate/pwa-common/streams';
import { SUBMIT_RESERVATION_SUCCESS } from './constants';

export const submitReservationSuccess$ = main$
  .filter(({ action }) => action.type === SUBMIT_RESERVATION_SUCCESS);
