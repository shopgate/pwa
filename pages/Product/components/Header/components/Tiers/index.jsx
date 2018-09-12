import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_TIERS,
  PRODUCT_TIERS_AFTER,
  PRODUCT_TIERS_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import Tier from './components/Tier';
import connect from './connector';
import styles from './style';

/**
 * The Tiers component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Tiers = ({ price }) => {
  if (!(price && price.tiers && price.tiers.length > 0)) {
    return null;
  }

  return (
    <Fragment>
      <Portal name={PRODUCT_TIERS_BEFORE} />
      <Portal name={PRODUCT_TIERS}>
        <div className={styles.wrapper}>
          {price.tiers.map(tier => <Tier tier={tier} price={price} key={`${Object.values(tier).join('_')}`} />)}
        </div>
      </Portal>
      <Portal name={PRODUCT_TIERS_AFTER} />
    </Fragment>
  );
};

Tiers.propTypes = {
  price: PropTypes.shape(),
};

Tiers.defaultProps = {
  price: null,
};

export { Tiers as TiersUnconnected };
export default connect(pure(Tiers));
