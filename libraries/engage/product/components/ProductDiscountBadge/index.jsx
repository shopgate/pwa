import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { SurroundPortals } from '@shopgate/engage/components';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import { PRODUCT_DISCOUNT } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { useWidgetSettings } from '@shopgate/engage/core';
import ProductBadges from '../ProductBadges';
import styles from './style';
import connect from './connector';

/**
 * ProductDiscountBadge
 * @return {JSX}
 */
const ProductDiscountBadge = ({ productId, discount }) => {
  const {
    pdp = {
      show: true,
      style: {},
    },
  } = useWidgetSettings('@shopgate/engage/product/components/ProductDiscountBadge') || {};

  return (
    <ProductBadges
      className={styles.portal}
      location="productDiscountBadge"
      productId={productId}
      portalProps={{
        ...pdp,
      }}
    >
      { pdp.show && discount ? (
        <div
          className={`${styles.container} ${css(pdp.style)} theme__product__product-discount`}
          aria-hidden
        >
          <SurroundPortals portalName={PRODUCT_DISCOUNT} portalProps={{ productId, discount }}>
            <DiscountBadge className={styles.badge} text={`-${discount}%`} />
          </SurroundPortals>
        </div>
      ) : null}

    </ProductBadges>
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
