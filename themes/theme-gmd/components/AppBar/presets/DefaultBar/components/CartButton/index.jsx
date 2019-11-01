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
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { withWidgetSettings, i18n } from '@shopgate/engage/core';
import Badge from '../CartBadge';
import connect from './connector';
import styles from './style';
import transition from './transition';

const { colors } = themeConfig;

/**
 * The CartButton component.
 */
class CartButton extends PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    navigate: PropTypes.func.isRequired,
    widgetSettings: PropTypes.shape().isRequired,
  };

  /**
   * @returns {JSX}
   */
  get badge() {
    const { count } = this.props;
    return () => <Badge style={this.style.badge} count={count} />;
  }

  /**
   * @returns {JSX}
   */
  get style() {
    const {
      buttonCartBackground,
      buttonCartColor,
      buttonCartBadgeBackground,
      buttonCartBadgeColor,
    } = this.props.widgetSettings;

    return {
      icon: {
        background: buttonCartBackground || colors.primary,
        color: buttonCartColor || colors.primaryContrast,
      },
      badge: {
        background: buttonCartBadgeBackground,
        color: buttonCartBadgeColor,
      },
    };
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
            <Portal name={APP_BAR_CART_BUTTON}>
              <div className={styles} style={transition[state]}>
                <AppBar.Icon
                  {...this.style.icon}
                  badge={this.badge}
                  icon={CartIcon}
                  onClick={navigate}
                  testId="CartButton"
                  aria-label={i18n.text('navigation.cart')}
                  aria-hidden={!count}
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

export default withWidgetSettings(connect(CartButton), '@shopgate/engage/components/AppBar');
