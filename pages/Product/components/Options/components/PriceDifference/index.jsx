import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Price from '@shopgate/pwa-ui-shared/Price';
import styles from './style';

/**
 * The price difference component
 * @param {Object} props The component props
 * @param {string} props.className A custom css class string.
 * @param {string} props.currency The currency of the price.
 * @param {number} props.difference The price difference.
 * @return {JSX}
 */
const PriceDifference = ({ className, currency, difference }) => {
  if (difference === 0) {
    return null;
  }

  const priceClassName = classNames(
    className,
    {
      [styles.positive]: difference > 0,
      [styles.negative]: difference < 0,
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
