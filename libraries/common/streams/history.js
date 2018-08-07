import { OPEN_LINK } from '../constants/ActionTypes';
import { REGISTER_PATH } from '../constants/RoutePaths';
import { main$ } from './main';

/**
 * Gets triggered when a link is opened.
 * @type {Observable}
 */
export const openedLink$ = main$
  .filter(({ action }) => action.type === OPEN_LINK);

/**
 * Gets triggered when the registration link is opened.
 * @type {Observable}
 */
export const openedRegisterLink$ = openedLink$
  .filter(({ action }) =>
    action.options &&
    action.options.url &&
    action.options.url === REGISTER_PATH);
