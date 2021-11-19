import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import { PRODUCT_DISCOUNT } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { useWidgetSettings } from '@shopgate/engage/core';
import { css } from 'glamor';
import styles from './style';
import connect from './connector';

/**
 * ProductDiscountBadge
 * @return {JSX}
 */
const ProductDiscountBadge = ({ productId, discount }) => {
  const {
    pdp = {
      show: false,
      style: {},
    },
  } = useWidgetSettings('@shopgate/engage/product/components/ProductDiscountBadge') || {};

  if (!pdp.show) {
    return null;
  }

  if (!discount) {
    return null;
  }

  return (
    <div
      className={`${styles.container} ${css(pdp.style)} theme__product__product-discount`}
      aria-hidden
    >
      <SurroundPortals portalName={PRODUCT_DISCOUNT} portalProps={{ productId, discount }}>
        <DiscountBadge className={styles.badge} text={`-${discount}%`} />
      </SurroundPortals>
    </div>
  );
};

ProductDiscountBadge.propTypes = {
  productId: PropTypes.string.isRequired,
  discount: PropTypes.number,
};

ProductDiscountBadge.defaultProps = {
  discount: null,
};

export default connect(ProductDiscountBadge);
