import React from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import {
  PRODUCT_CARD_BADGE,
  PRODUCT_CARD_BADGE_BEFORE,
  PRODUCT_CARD_BADGE_AFTER,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import styles from './style';

/**
 * @returns {JSX}
 */
function ProductCardBadge({ productId, style, value }) {
  const props = { productId };

  return (
    <div className={styles} style={style}>
      <Portal name={PRODUCT_CARD_BADGE_BEFORE} props={props} />
      <Portal name={PRODUCT_CARD_BADGE} props={props}>
        <DiscountBadge text={`${value}%`} />
      </Portal>
      <Portal name={PRODUCT_CARD_BADGE_AFTER} props={props} />
    </div>
  );
}

ProductCardBadge.propTypes = {
  productId: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  style: PropTypes.shape(),
};

ProductCardBadge.defaultProps = {
  style: {},
};

export default ProductCardBadge;
