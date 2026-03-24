import React from 'react';
import PropTypes from 'prop-types';
import { Portal, DiscountBadge } from '@shopgate/engage/components';
import {
  PRODUCT_ITEM_DISCOUNT,
  PRODUCT_ITEM_DISCOUNT_BEFORE,
  PRODUCT_ITEM_DISCOUNT_AFTER,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  root: {
    fontWeight: 500,
    marginBottom: variables.gap.small,
    width: 'auto',
  },
});

/**
 * The LiveshoppingDiscount component.
 * @param {Object} props The component props.
 * @param {Object} props.productId The productId.
 * @returns {JSX}
 */
function LiveshoppingDiscount({ discount, productId }) {
  const { classes } = useStyles();
  const portalProps = { productId };

  return (
    <>
      <Portal name={PRODUCT_ITEM_DISCOUNT_BEFORE} props={portalProps} />
      <Portal name={PRODUCT_ITEM_DISCOUNT} props={portalProps}>
        <DiscountBadge
          text={i18n.text('liveshopping.discount_badge', [discount])}
          discount={discount}
          display="big"
          className={classes.root}
        />
      </Portal>
      <Portal name={PRODUCT_ITEM_DISCOUNT_AFTER} props={portalProps} />
    </>
  );
}

LiveshoppingDiscount.propTypes = {
  discount: PropTypes.number.isRequired,
  productId: PropTypes.string.isRequired,
};

export default LiveshoppingDiscount;
