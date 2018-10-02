import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import styles from './style';

/**
 * The CartButtonBadge component.
 */
class CartButtonBadge extends PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
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
   * @returns {JSX}
   */
  render() {
    return (
      <div className={styles}>{this.productCount}</div>
    );
  }
}

export default CartButtonBadge;
