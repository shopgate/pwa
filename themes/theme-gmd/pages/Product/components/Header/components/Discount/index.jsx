import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()({
  placeholder: {
    height: 20,
    width: '50px',
    display: 'inline-block',
  },
  discount: {
    width: 40,
    display: 'inline-block',
  },
});

/**
 * The Discount component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Discount = ({ price }) => {
  const { classes, cx } = useStyles();

  if (price && typeof price.discount === 'undefined') {
    return null;
  }

  return (
    <PlaceholderLabel ready={(price !== null)} className={classes.placeholder}>
      {!!(price && price.discount) && (
        <div className={cx(classes.discount, 'theme__product__header__discount')}>
          <DiscountBadge text={`-${price.discount}%`} />
        </div>
      )}
    </PlaceholderLabel>
  );
};

Discount.propTypes = {
  price: PropTypes.shape(),
};

Discount.defaultProps = {
  price: null,
};

export default connect(Discount);
