import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_SHIPPING,
  PRODUCT_SHIPPING_AFTER,
  PRODUCT_SHIPPING_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import { makeStyles } from '@shopgate/engage/styles';
import { useStickyValue } from '@shopgate/engage/product/hooks';
import { ProductContext } from '../../context';
import Label from './components/Label';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  placeholder: {
    height: 16,
    width: '70%',
    marginTop: 5,
    marginBottom: 2,
  },
  shipping: {
    fontSize: theme.typography.body2.fontSize,
  },
}));

/**
 * The Shipping Info component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Shipping = ({ shipping: currentShipping, isLoading }) => {
  const { classes, cx } = useStyles();
  const { productId } = useContext(ProductContext) || {};
  const shipping = useStickyValue(currentShipping, isLoading, productId);

  return (
    <>
      <Portal name={PRODUCT_SHIPPING_BEFORE} />
      <Portal name={PRODUCT_SHIPPING}>
        <PlaceholderLabel className={classes.placeholder} ready={(shipping !== null)}>
          {shipping && typeof shipping.price !== 'undefined' && shipping.price !== null && (
            <Label className={cx(classes.shipping, 'engage__product__header__shipping')} price={shipping.price} currency={shipping.currency} />
          )}
        </PlaceholderLabel>
      </Portal>
      <Portal name={PRODUCT_SHIPPING_AFTER} />
    </>
  );
};

Shipping.propTypes = {
  isLoading: PropTypes.bool,
  shipping: PropTypes.shape(),
};

Shipping.defaultProps = {
  isLoading: false,
  shipping: null,
};

export default connect(memo(Shipping));
