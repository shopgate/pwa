import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_ITEM_DISCOUNT,
  PRODUCT_ITEM_DISCOUNT_AFTER,
  PRODUCT_ITEM_DISCOUNT_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    minWidth: 40,
  },
});

/**
 * The item discount component.
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
const ItemDiscount = ({ productId, discount }) => {
  const { classes, cx } = useStyles();
  const portalProps = { productId };

  if (!discount) {
    return null;
  }

  return (
    <div className={cx(classes.root, 'theme__product-grid__item__item-discount')}>
      <Portal name={PRODUCT_ITEM_DISCOUNT_BEFORE} props={portalProps} />
      <Portal name={PRODUCT_ITEM_DISCOUNT} props={portalProps}>
        <DiscountBadge text={`-${discount}%`} />
      </Portal>
      <Portal name={PRODUCT_ITEM_DISCOUNT_AFTER} props={portalProps} />
    </div>
  );
};

ItemDiscount.propTypes = {
  productId: PropTypes.string.isRequired,
  discount: PropTypes.number,
};

ItemDiscount.defaultProps = {
  discount: null,
};

export default memo(ItemDiscount);
