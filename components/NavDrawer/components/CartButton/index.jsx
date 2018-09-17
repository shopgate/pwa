import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_CART,
  NAV_MENU_CART_AFTER,
  NAV_MENU_CART_BEFORE,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import ShoppingCartIcon from '@shopgate/pwa-ui-shared/icons/ShoppingCartIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import connect from '../../connector';
import Badge from './components/Badge';

const LABEL = 'navigation.cart';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const CartButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_CART_BEFORE} />
    <Portal name={NAV_MENU_CART}>
      <NavDrawer.Item
        badge={Badge}
        label={LABEL}
        icon={ShoppingCartIcon}
        onClick={navigate(CART_PATH, LABEL)}
        testId="navDrawerCartButton"
      />
    </Portal>
    <Portal name={NAV_MENU_CART_AFTER} />
  </Fragment>
);

CartButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(CartButton);
