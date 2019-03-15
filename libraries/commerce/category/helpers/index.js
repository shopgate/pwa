import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '../constants';

/**
 * Generate category route for navigation.
 * @param {string} id category Id
 * @returns {string}
 */
export const getCategoryRoute = id => `${CATEGORY_PATH}/${bin2hex(id)}`;

