/**
 * @param {Object} state State
 * @returns {Object}
 */
const getBase = state => state.account;

/**
 * @param {Object} state State
 * @returns {Array}
 */
export const getCustomer = state => getBase(state).customer.data;
