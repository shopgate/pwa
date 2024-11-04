import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  SOFT_OPT_IN_SHOWN,
  SOFT_OPT_IN_SELECTED,
  HARD_OPT_IN_SHOWN,
  HARD_OPT_IN_SELECTED,
} from '../constants';

/**
 * Gets triggered when a SOFT_OPT_IN_SHOWN action was dispatched
 * @type {Observable}
 */
export const softOptInShown$ = main$
  .filter(({ action }) => action.type === SOFT_OPT_IN_SHOWN);

/**
 * Gets triggered when a SOFT_OPT_IN_SELECTED action was dispatched
 * @type {Observable}
 */
export const softOptInSelected$ = main$
  .filter(({ action }) => action.type === SOFT_OPT_IN_SELECTED);

/**
 * Gets triggered when a HARD_OPT_IN_SHOWN action was dispatched
 * @type {Observable}
 */
export const hardOptInShown$ = main$
  .filter(({ action }) => action.type === HARD_OPT_IN_SHOWN);

/**
 * Gets triggered when a HARD_OPT_IN_SELECTED action was dispatched
 * @type {Observable}
 */
export const hardOptInSelected$ = main$
  .filter(({ action }) => action.type === HARD_OPT_IN_SELECTED);
