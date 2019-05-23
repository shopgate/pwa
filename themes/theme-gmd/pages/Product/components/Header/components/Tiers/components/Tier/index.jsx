import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { I18n } from '@shopgate/engage/components';
import styles from '../../style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Tier = ({ tier, price }) => {
  // Skip tier if tier price is equal the product price
  if (tier.unitPrice === price.totalPrice) {
    return null;
  }

  const i18nKey = tier.from === tier.to ? 'price.tier.set' : 'price.tier.range';
  const params = { from: tier.from };

  return (
    <I18n.Text string={i18nKey} params={params} key={tier.from} className={styles.tier}>
      <I18n.Price forKey="price" price={tier.unitPrice} currency={price.currency} className={styles.price} />
    </I18n.Text>
  );
};

Tier.propTypes = {
  price: PropTypes.shape().isRequired,
  tier: PropTypes.shape().isRequired,
};

export default pure(Tier);
