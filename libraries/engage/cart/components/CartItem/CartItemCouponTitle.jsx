import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  title: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.125,
    marginBottom: 4,
  },
});

/**
 * The CouponTitle component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
export function CartItemCouponTitle({ value }) {
  const { classes } = useStyles();
  const title = useMemo(() => (
    value || i18n.text('cart.default_coupon_label')
  ), [value]);

  return (
    <div className={classes.title}>
      {title}
    </div>
  );
}

CartItemCouponTitle.propTypes = {
  value: PropTypes.string,
};

CartItemCouponTitle.defaultProps = {
  value: null,
};
