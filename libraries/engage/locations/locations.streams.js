import { main$ } from '@shopgate/pwa-common/streams';
import { SUBMIT_RESERVATION_SUCCESS, RECEIVE_PRODUCT_LOCATIONS } from './constants';

export const submitReservationSuccess$ = main$
  .filter(({ action }) => action.type === SUBMIT_RESERVATION_SUCCESS);

export const receiveProductLocations$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT_LOCATIONS);
