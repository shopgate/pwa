import React from 'react';
import CartIcon from 'Components/icons/CartIcon';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import TabBarAction from '../TabBarAction';
import CartItemBadge from './components/CartItemBadge';
import styles from './style';

/**
 * Opens the link on click on the action.
 */
const handleClick = () => {
  const link = new ParsedLink(CART_PATH);
  link.open();
};

/**
 * Renders the tab bar cart action component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const TabBarCartAction = props => (
  <TabBarAction
    {...props}
    icon={<CartIcon className={styles} />}
    onClick={handleClick}
  >
    <CartItemBadge />
  </TabBarAction>
);

TabBarCartAction.propTypes = {
  ...TabBarAction.propTypes,
};
TabBarCartAction.defaultProps = TabBarAction.defaultProps;

export default TabBarCartAction;
