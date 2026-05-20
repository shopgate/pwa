import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_PRICE_INFO,
  PRODUCT_PRICE_INFO_AFTER,
  PRODUCT_PRICE_INFO_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import { PriceInfo as PriceInfoBase } from '@shopgate/engage/product';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()({
  placeholder: {
    height: 20,
    width: '50px',
    display: 'inline-block',
  },
  priceInfo: {
    fontSize: '0.875rem',
    marginTop: 4,
  },
});

/**
 * The PriceInfo component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PriceInfo = ({ product }) => {
  const { classes } = useStyles();

  return (
    <>
      <Portal name={PRODUCT_PRICE_INFO_BEFORE} />
      <Portal name={PRODUCT_PRICE_INFO}>
        <PlaceholderLabel ready={(product !== null)} className={classes.placeholder}>
          <PriceInfoBase product={product} className={classes.priceInfo} />
        </PlaceholderLabel>
      </Portal>
      <Portal name={PRODUCT_PRICE_INFO_AFTER} />
    </>
  );
};

PriceInfo.propTypes = {
  product: PropTypes.shape(),
};

PriceInfo.defaultProps = {
  product: null,
};

export default connect(memo(PriceInfo));
