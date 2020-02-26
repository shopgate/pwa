// @flow
import { main$ } from '@shopgate/pwa-common/streams';
import {
  REQUEST_CORE_CONFIG,
  RECEIVE_CORE_CONFIG,
  ERROR_CORE_CONFIG,
} from './config.constants';

/** @type {Observable} */
export const requestCoreConfig$ = main$.filter(({ action }) => action.type === REQUEST_CORE_CONFIG);

/** @type {Observable} */
export const receiveCoreConfig$ = main$.filter(({ action }) => action.type === RECEIVE_CORE_CONFIG);

/** @type {Observable} */
export const errorCoreConfig$ = main$.filter(({ action }) => action.type === ERROR_CORE_CONFIG);
