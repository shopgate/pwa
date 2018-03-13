import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from 'Components/PlaceholderLabel';
import PriceBase from 'Components/Price';
import connect from './connector';
import styles from './style';

/**
 * The Price component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Price = ({ price }) => (
  <PlaceholderLabel ready={(price !== null)} className={styles.placeholder}>
    {(price && price.unitPrice) && (
      <PriceBase
        className={styles.price}
        currency={price.currency}
        discounted={!!price.discount}
        taxDisclaimer
        unitPrice={price.totalPrice}
        unitPriceMin={price.unitPriceMin}
      />
    )}
  </PlaceholderLabel>
);

Price.propTypes = {
  price: PropTypes.shape(),
};

Price.defaultProps = {
  price: null,
};

export default connect(Price);
