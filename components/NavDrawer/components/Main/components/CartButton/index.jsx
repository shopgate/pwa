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
import { i18n } from '@shopgate/engage/core';
import connect from '../../../../connector';
import connectBadge from './components/Badge/connector';
import Badge from './components/Badge';
import portalProps from '../../../../portalProps';

const LABEL = 'navigation.cart';

/**
 * @param {Function} props.navigate The navigate action.
 * @param {Function} props.count The cart item count.
 * @returns {JSX}
 */
const CartButton = ({ navigate, count }) => {
  const ariaLabel = `${i18n.text(LABEL)}. ${i18n.text('common.products')}: ${count}.`;
  return (
    <Fragment>
      <Portal name={NAV_MENU_CART_BEFORE} props={portalProps} />
      <Portal name={NAV_MENU_CART} props={portalProps}>
        <NavDrawer.Item
          badge={Badge}
          label={LABEL}
          aria-label={ariaLabel}
          icon={ShoppingCartIcon}
          onClick={navigate(CART_PATH, LABEL)}
          testId="navDrawerCartButton"
        />
      </Portal>
      <Portal name={NAV_MENU_CART_AFTER} props={portalProps} />
    </Fragment>
  );
};

CartButton.propTypes = {
  navigate: PropTypes.func.isRequired,
  count: PropTypes.number,
};

CartButton.defaultProps = {
  count: 0,
};

export default connect(connectBadge(CartButton));
