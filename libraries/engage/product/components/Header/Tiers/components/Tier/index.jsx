import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  tier: {
    display: 'block',
    lineHeight: 1.35,
  },
  price: {
    fontWeight: 500,
  },
});

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Tier = ({ tier, price }) => {
  const { classes } = useStyles();

  // Skip tier with quantity 1
  if (tier.from <= 1) {
    return null;
  }

  const i18nKey = tier.from === tier.to ? 'price.tier.set' : 'price.tier.range';
  const params = { from: tier.from };

  return (
    // eslint-disable-next-line jsx-a11y/aria-role
    <I18n.Text string={i18nKey} params={params} key={tier.from} className={classes.tier} role="text">
      <I18n.Price forKey="price" price={tier.unitPrice} currency={price.currency} className={classes.price} />
    </I18n.Text>
  );
};

Tier.propTypes = {
  price: PropTypes.shape().isRequired,
  tier: PropTypes.shape().isRequired,
};

export default memo(Tier);
