import { OPEN_LINK } from '../constants/ActionTypes';
import { main$ } from './main';

/**
 * Gets triggered when a link is opened.
 * @type {Observable}
 */
export const openedLink$ = main$
  .filter(({ action }) => action.type === OPEN_LINK);
