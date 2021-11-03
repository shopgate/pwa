import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import {
  PRODUCT_DISCOUNT,
  PRODUCT_DISCOUNT_AFTER,
  PRODUCT_DISCOUNT_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import styles from './style';
import connect from './connector';

/**
 * The item discount component.
 */
class ProductDiscountBadge extends PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    discount: PropTypes.number,
  };

  static defaultProps = {
    discount: null,
  }

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
      <div className={`${styles} theme__product__product-discount`} aria-hidden>
        <Portal name={PRODUCT_DISCOUNT_BEFORE} props={props} />
        <Portal name={PRODUCT_DISCOUNT} props={props}>
          <DiscountBadge text={`-${discount}%`} />
        </Portal>
        <Portal name={PRODUCT_DISCOUNT_AFTER} props={props} />
      </div>
    );
  }
}

export default connect(ProductDiscountBadge);
