import { main$ } from './main';
import { NAVIGATE } from '../constants/ActionTypes';

/**
 * @type {Observable}
 */
export const navigate$ = main$
  .filter(({ action }) => action.type === NAVIGATE);
