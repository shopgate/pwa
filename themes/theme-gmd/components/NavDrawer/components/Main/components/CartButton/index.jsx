import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_CART,
  NAV_MENU_CART_AFTER,
  NAV_MENU_CART_BEFORE,
  CART_PATH,
} from '@shopgate/engage/cart';
import { Portal, NavDrawer, ShoppingCartIcon } from '@shopgate/engage/components';
import connect from '../../../../connector';
import Badge from './components/Badge';
import portalProps from '../../../../portalProps';

const LABEL = 'navigation.cart';

/**
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const CartButton = ({ navigate }) => (
  <Fragment>
    <Portal name={NAV_MENU_CART_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_CART} props={portalProps}>
      <NavDrawer.Item
        badge={Badge}
        label={LABEL}
        icon={ShoppingCartIcon}
        onClick={navigate(CART_PATH, LABEL)}
        testId="navDrawerCartButton"
      />
    </Portal>
    <Portal name={NAV_MENU_CART_AFTER} props={portalProps} />
  </Fragment>
);

CartButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default connect(CartButton);
