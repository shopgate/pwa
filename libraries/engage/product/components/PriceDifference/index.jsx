import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Price from '@shopgate/pwa-ui-shared/Price';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  positive: {
    color: colors.shade4,
    ':before': {
      content: '"+"',
    },
  },
  negative: {
    color: 'var(--color-primary)',
  },
});

/**
 * The price difference component
 * @param {Object} props The component props
 * @param {string} props.className A custom css class string.
 * @param {string} props.currency The currency of the price.
 * @param {number} props.difference The price difference.
 * @return {JSX}
 */
const PriceDifference = ({ className, currency, difference }) => {
  const { classes } = useStyles();

  if (difference === 0) {
    return null;
  }

  const priceClassName = classNames(
    className,
    {
      [classes.positive]: difference > 0,
      [classes.negative]: difference < 0,
    }
  );

  return (
    <Price
      className={priceClassName}
      currency={currency}
      unitPrice={difference}
    />
  );
};

PriceDifference.propTypes = {
  currency: PropTypes.string.isRequired,
  difference: PropTypes.number.isRequired,
  className: PropTypes.string,
};

PriceDifference.defaultProps = {
  className: '',
};

export default PriceDifference;
