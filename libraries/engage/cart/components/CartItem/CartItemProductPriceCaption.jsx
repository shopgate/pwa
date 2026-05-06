import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import {
  ROPIS,
//  BOPIS,
} from '@shopgate/engage/locations';
import { I18n } from '@shopgate/engage/components';
import { useCartItemProduct } from './CartItem.hooks';

const useStyles = makeStyles()(theme => ({
  caption: {
    fontSize: '0.75rem',
    lineHeight: '0.875rem',
    color: theme.palette.text.secondary,
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
    <span className={cx(classes.caption, className)}>
      (
      <I18n.Text string={label} />
      )
    </span>
  );
};

CartItemProductPriceCaption.propTypes = {
  className: PropTypes.string,
};

CartItemProductPriceCaption.defaultProps = {
  className: null,
};

export { CartItemProductPriceCaption };
