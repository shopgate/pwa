import { consume } from 'redux-props';
import { getCartProductCount } from '@shopgate/pwa-common-commerce/cart/selectors';

/**
 * @returns {Object}
 */
const mapProps = ({ state }) => ({
  count: getCartProductCount(state),
});

export default consume({ mapProps });
