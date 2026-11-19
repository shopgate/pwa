import { main$ } from '@shopgate/pwa-common/streams';
import { SUCCESS_REGISTRATION } from '../constants/actionTypes';

/** @import { Observable } from 'rxjs/Observable' */

/**
 * Gets triggered when registration was successful via the shopgate.user.register pipeline
 * @type {Observable}
 */
export const registrationSuccess$ = main$
  .filter(({ action }) => action.type === SUCCESS_REGISTRATION);
