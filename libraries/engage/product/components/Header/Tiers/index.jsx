import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_TIERS,
  PRODUCT_TIERS_AFTER,
  PRODUCT_TIERS_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { makeStyles } from '@shopgate/engage/styles';
import Tier from './components/Tier';
import connect from './connector';

const useStyles = makeStyles()({
  wrapper: {
    marginTop: 4,
    fontSize: '0.875rem',
  },
  tier: {
    display: 'block',
    lineHeight: 1.35,
  },
  price: {
    fontWeight: 500,
  },
});

/**
 * The Tiers component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Tiers = ({ price }) => {
  const { classes, cx } = useStyles();

  if (!(price && price.tiers && price.tiers.length > 0)) {
    return null;
  }

  return (
    <>
      <Portal name={PRODUCT_TIERS_BEFORE} />
      <Portal name={PRODUCT_TIERS}>
        <div className={cx(classes.wrapper, 'engage__product__header__tiers')}>
          {price.tiers.map(tier => (
            <Tier
              tier={tier}
              price={price}
              classes={{
                tier: classes.tier,
                price: classes.price,
              }}
              key={`${Object.values(tier).join('_')}`}
            />
          ))}
        </div>
      </Portal>
      <Portal name={PRODUCT_TIERS_AFTER} />
    </>
  );
};

Tiers.propTypes = {
  price: PropTypes.shape(),
};

Tiers.defaultProps = {
  price: null,
};

export default connect(memo(Tiers));
