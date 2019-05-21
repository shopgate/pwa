import {
  APP_DID_START,
  APP_WILL_START,
} from '../constants/ActionTypes';
import { main$ } from './main';

/**
 * Gets triggered before the app starts.
 * @type {Observable}
 */
export const appWillStart$ = main$
  .filter(({ action }) => action.type === APP_WILL_START);

/**
 * Gets triggered when the app starts.
 * @type {Observable}
 */
export const appDidStart$ = main$
  .filter(({ action }) => action.type === APP_DID_START);
