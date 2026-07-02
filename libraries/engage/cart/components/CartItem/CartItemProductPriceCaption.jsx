import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography, I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import {
  ROPIS,
//  BOPIS,
} from '@shopgate/engage/locations';
import { useCartItemProduct } from './CartItem.hooks';

const useStyles = makeStyles()(theme => ({
  caption: {
    lineHeight: '0.875rem',
    paddingTop: theme.spacing(0.5),
  },
}));

/**
 * @returns {JSX.Element}
 */
const CartItemProductPriceCaption = ({ className }) => {
  const { classes, cx } = useStyles();
  const { cartItem } = useCartItemProduct();

  const label = useMemo(() => {
    const labels = {
      [ROPIS]: 'cart.price_caption.reservation',
    //  [BOPIS]: 'cart.price_caption.pay_in_store',
    };

    const fulfillmentMethod = cartItem?.fulfillment?.method || null;

    return labels[fulfillmentMethod];
  }, [cartItem]);

  if (!label) {
    return null;
  }

  return (
    <Typography variant="caption" component="span" color="textSecondary" className={cx(classes.caption, className)}>
      (
      <I18n.Text string={label} />
      )
    </Typography>
  );
};

CartItemProductPriceCaption.propTypes = {
  className: PropTypes.string,
};

CartItemProductPriceCaption.defaultProps = {
  className: null,
};

export { CartItemProductPriceCaption };
