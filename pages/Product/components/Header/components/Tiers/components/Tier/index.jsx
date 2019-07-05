import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from '../../style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Tier = ({ tier, price }) => {
  // Skip tier with quantity 1
  if (tier.from <= 1) {
    return null;
  }

  const i18nKey = tier.from === tier.to ? 'price.tier.set' : 'price.tier.range';
  const params = { from: tier.from };

  return (
    // eslint-disable-next-line jsx-a11y/aria-role
    <I18n.Text string={i18nKey} params={params} key={tier.from} className={styles.tier} role="text">
      <I18n.Price forKey="price" price={tier.unitPrice} currency={price.currency} className={styles.price} />
    </I18n.Text>
  );
};

Tier.propTypes = {
  price: PropTypes.shape().isRequired,
  tier: PropTypes.shape().isRequired,
};

export default pure(Tier);
