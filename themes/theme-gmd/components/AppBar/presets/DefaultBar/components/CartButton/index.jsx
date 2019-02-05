import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { AppBar } from '@shopgate/pwa-ui-material';
import { CartIcon } from '@shopgate/pwa-ui-shared';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_CART_BUTTON,
  APP_BAR_CART_BUTTON_BEFORE,
  APP_BAR_CART_BUTTON_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import colors from 'Styles/colors';
import Badge from '../CartBadge';
import connect from './connector';
import styles from './style';
import transition from './transition';

/**
 * The CartButton component.
 */
class CartButton extends PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    navigate: PropTypes.func.isRequired,
  };

  /**
   * @returns {JSX}
   */
  get badge() {
    const { count } = this.props;
    return () => <Badge count={count} />;
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { count, navigate } = this.props;

    return (
      <Transition in={count > 0} timeout={250}>
        {state => (
          <Fragment key="cart">
            <Portal name={APP_BAR_CART_BUTTON_BEFORE} />
            <Portal name={APP_BAR_CART_BUTTON} >
              <div className={styles} style={transition[state]}>
                <AppBar.Icon
                  background={colors.primary}
                  badge={this.badge}
                  color={colors.primaryContrast}
                  icon={CartIcon}
                  onClick={navigate}
                  testId="CartButton"
                />
              </div>
            </Portal>
            <Portal name={APP_BAR_CART_BUTTON_AFTER} />
          </Fragment>
        )}
      </Transition>
    );
  }
}

export default connect(CartButton);
