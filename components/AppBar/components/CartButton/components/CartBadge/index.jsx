import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import connect from './connector';
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
    if (!this.props.count) {
      return null;
    }

    return (
      <div className={styles} data-test-id="badge">{this.productCount}</div>
    );
  }
}

export default connect(CartButtonBadge);
