import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { Typography } from '@shopgate/engage/components';

const useStyles = makeStyles()({
  title: {
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
    <Typography variant="h5" component="div" className={classes.title}>
      {title}
    </Typography>
  );
}

CartItemCouponTitle.propTypes = {
  value: PropTypes.string,
};

CartItemCouponTitle.defaultProps = {
  value: null,
};
