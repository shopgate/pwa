import { RECEIVE_CLIENT_INFORMATION } from '../constants/ActionTypes';
import { main$ } from './main';

/** @import { Observable } from 'rxjs/Observable' */

/**
 * Gets triggered after the client information was updated
 * @type {Observable}
 */
export const clientInformationDidUpdate$ = main$
  .filter(({ action }) => action.type === RECEIVE_CLIENT_INFORMATION);
