import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals, DiscountBadge } from '@shopgate/engage/components';
import { PRODUCT_ITEM_DISCOUNT } from '@shopgate/engage/category';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    minWidth: 40,
  },
});

/**
 * The item discount component
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
const ItemDiscount = ({
  productId,
  discount,
}) => {
  const { classes, cx } = useStyles();

  const portalProps = useMemo(() => ({ productId }), [productId]);

  if (!discount) {
    return null;
  }

  return (
    <div className={cx(classes.root, 'theme__product-grid__item__item-discount')}>
      <SurroundPortals portalName={PRODUCT_ITEM_DISCOUNT} portalProps={portalProps}>
        <DiscountBadge text={`-${discount}%`} />
      </SurroundPortals>
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
