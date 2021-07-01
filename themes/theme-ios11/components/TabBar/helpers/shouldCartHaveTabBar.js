import { getCartItems } from '@shopgate/pwa-common-commerce/cart/selectors';

/**
 * Whether the tab bar should be visible for the cart page.
 * @param {Object} state The application state
 * @returns {bool}
 */
const shouldCartHaveTabBar = state => getCartItems(state).length === 0;

export default shouldCartHaveTabBar;
