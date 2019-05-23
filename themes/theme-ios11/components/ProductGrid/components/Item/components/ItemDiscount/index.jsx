import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import {
  PRODUCT_ITEM_DISCOUNT,
  PRODUCT_ITEM_DISCOUNT_AFTER,
  PRODUCT_ITEM_DISCOUNT_BEFORE,
} from '@shopgate/engage/category';
import { DiscountBadge } from '@shopgate/engage/components';
import styles from './style';

/**
 * The item discount component.
 */
class ItemDiscount extends PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    discount: PropTypes.number,
  };

  static defaultProps = {
    discount: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { productId, discount } = this.props;
    const props = { productId };

    if (!discount) {
      return null;
    }

    return (
      <div className={styles}>
        <Portal name={PRODUCT_ITEM_DISCOUNT_BEFORE} props={props} />
        <Portal name={PRODUCT_ITEM_DISCOUNT} props={props}>
          <DiscountBadge text={`-${discount}%`} />
        </Portal>
        <Portal name={PRODUCT_ITEM_DISCOUNT_AFTER} props={props} />
      </div>
    );
  }
}

export default ItemDiscount;
