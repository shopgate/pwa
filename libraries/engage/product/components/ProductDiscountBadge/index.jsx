import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import { PRODUCT_DISCOUNT } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { useWidgetSettings } from '@shopgate/engage/core';
import ProductBadges from '../ProductBadges';
import connect from './connector';

const useStyles = makeStyles()(() => ({
  portal: {
    top: 12,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      top: 25,
      left: 25,
    },
  },
  container: {
    minWidth: 65,
    zIndex: 10,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      minWidth: 50,
    },
  },
  badge: {
    fontSize: '1.15rem',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      fontSize: 14,
    },
  },
}));

/**
 * ProductDiscountBadge
 * @return {JSX.Element}
 */
const ProductDiscountBadge = ({ productId, discount }) => {
  const {
    pdp = {
      show: false,
      style: {},
    },
  } = useWidgetSettings('@shopgate/engage/product/components/ProductDiscountBadge') || {};
  const { classes, cx, css } = useStyles();

  return (
    <ProductBadges
      className={classes.portal}
      location="productDiscountBadge"
      productId={productId}
      portalProps={{
        ...pdp,
      }}
    >
      { pdp.show && discount ? (
        <div className={cx(classes.container, css(pdp.style), 'theme__product__product-discount')}>
          <SurroundPortals
            portalName={PRODUCT_DISCOUNT}
            portalProps={{
              productId,
              discount,
            }}
          >
            <DiscountBadge className={classes.badge} text={`-${discount}%`} />
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
