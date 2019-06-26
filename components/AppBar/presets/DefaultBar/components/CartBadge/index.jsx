import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import { withWidgetSettings } from '@shopgate/engage/core';
import styles from './style';

/**
 * The CartButtonBadge component.
 */
class CartButtonBadge extends PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    widgetSettings: PropTypes.shape().isRequired,
  };

  /**
   * @returns {string}
   */
  get productCount() {
    const { count } = this.props;

    let productCount = `${count}`;

    if (count > CART_MAX_ITEMS) {
      productCount = `${CART_MAX_ITEMS}+`;
    }

    return productCount;
  }

  /**
   * @returns {Object}
   */
  get style() {
    const { buttonCartColor, buttonCartBackground } = this.props.widgetSettings;

    return {
      background: buttonCartColor,
      color: buttonCartBackground,
    };
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <div style={this.style} className={styles}>{this.productCount}</div>
    );
  }
}

export default withWidgetSettings(CartButtonBadge, '@shopgate/engage/components/AppBar');
