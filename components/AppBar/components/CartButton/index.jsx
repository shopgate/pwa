import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AppBar, CartIcon } from '@shopgate/pwa-ui-ios';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_CART_BUTTON,
  APP_BAR_CART_BUTTON_BEFORE,
  APP_BAR_CART_BUTTON_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import Badge from './components/CartBadge';
import connect from './connector';
import styles from './style';

/**
 * @returns {JSX}
 */
const Icon = () => (
  <CartIcon size={20} />
);

/**
 * The CartButton component.
 */
class CartButton extends PureComponent {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { navigate } = this.props;

    return (
      <Fragment key="cart">
        <Portal name={APP_BAR_CART_BUTTON_BEFORE} />
        <Portal name={APP_BAR_CART_BUTTON} >
          <div className={styles} data-test-id="CartButton" aria-hidden>
            <AppBar.Icon
              badge={Badge}
              icon={Icon}
              onClick={navigate}
            />
          </div>
        </Portal>
        <Portal name={APP_BAR_CART_BUTTON_AFTER} />
      </Fragment>
    );
  }
}

export default connect(CartButton);
