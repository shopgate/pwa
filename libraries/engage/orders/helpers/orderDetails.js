import { ORDER_DETAILS_PRIVATE_PATH } from '../constants/routes';

/**
 * Generate route to order details.
 * @param {string} orderNumber The order number.
 * @returns {string}
 */
export const getOrderDetailsRoute = orderNumber => `${ORDER_DETAILS_PRIVATE_PATH}/${orderNumber}`;
