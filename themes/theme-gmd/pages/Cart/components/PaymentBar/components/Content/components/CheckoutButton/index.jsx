import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Link';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CART_CHECKOUT_BUTTON,
  CART_CHECKOUT_BUTTON_AFTER,
  CART_CHECKOUT_BUTTON_BEFORE,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import connect from './connector';
import styles from './style';

/**
 * The checkout button component.
 * @param {boolean} isActive Should the button shown as active.
 * @return {JSX}
 */
const CheckoutButton = ({ isActive }) => (
  <Fragment>
    <Portal name={CART_CHECKOUT_BUTTON_BEFORE} props={{ isActive }} />
    <Portal name={CART_CHECKOUT_BUTTON} props={{ isActive }} >
      <Link href={CHECKOUT_PATH} disabled={!isActive}>
        <RippleButton
          disabled={!isActive}
          type="regular"
          className={isActive ? styles.button : styles.disabledButton}
        >
          <I18n.Text string="cart.checkout" />
        </RippleButton>
      </Link>
    </Portal>
    <Portal name={CART_CHECKOUT_BUTTON_AFTER} props={{ isActive }} />
  </Fragment>
);

CheckoutButton.propTypes = {
  isActive: PropTypes.bool,
};

CheckoutButton.defaultProps = {
  isActive: true,
};

export default connect(({ isOrderable }) => (
  <LoadingContext.Consumer>
    {({ isLoading }) => (
      <CheckoutButton isActive={isOrderable && !isLoading(CART_PATH)} />
    )}
  </LoadingContext.Consumer>
));

