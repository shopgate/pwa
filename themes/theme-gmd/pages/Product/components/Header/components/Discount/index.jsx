import React from 'react';
import PropTypes from 'prop-types';
import { PlaceholderLabel, DiscountBadge } from '@shopgate/engage/components';
import connect from './connector';
import styles from './style';

/**
 * The Discount component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Discount = ({ price }) => {
  if (price && typeof price.discount === 'undefined') {
    return null;
  }

  return (
    <PlaceholderLabel ready={(price !== null)} className={styles.placeholder}>
      {!!(price && price.discount) && (
        <div className={styles.discount}>
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
