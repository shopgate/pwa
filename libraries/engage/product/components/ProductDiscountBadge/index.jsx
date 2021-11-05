import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import {
  PRODUCT_DISCOUNT,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { useWidgetSettings } from '@shopgate/engage/core';
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
    const { pdp = { show: false, style: {} } } = useWidgetSettings('@shopgate/engage/product/components/ProductDiscountBadge') || {};

    if (!pdp.show) {
      return null;
    }

    const { productId, discount } = this.props;
    const props = { productId };

    if (!discount) {
      return null;
    }

    return (
      <div style={pdp.style} className={`${styles.container} theme__product__product-discount`} aria-hidden>
        <SurroundPortals portalName={PRODUCT_DISCOUNT} portalProps={props}>
          <DiscountBadge className={styles.badge} text={`-${discount}%`} />
        </SurroundPortals>
      </div>
    );
  }
}

export default connect(ProductDiscountBadge);
