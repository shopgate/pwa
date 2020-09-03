import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_PRICE_INFO,
  PRODUCT_PRICE_INFO_AFTER,
  PRODUCT_PRICE_INFO_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import { PriceInfo as PriceInfoBase } from '@shopgate/engage/product';
import connect from './connector';
import styles from './style';

/**
 * The PriceInfo component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PriceInfo = ({ product }) => (
  <Fragment>
    <Portal name={PRODUCT_PRICE_INFO_BEFORE} />
    <Portal name={PRODUCT_PRICE_INFO}>
      <PlaceholderLabel ready={(product !== null)} className={styles.placeholder}>
        <PriceInfoBase product={product} className={styles.priceInfo} />
      </PlaceholderLabel>
    </Portal>
    <Portal name={PRODUCT_PRICE_INFO_AFTER} />
  </Fragment>
);

PriceInfo.propTypes = {
  product: PropTypes.shape(),
};

PriceInfo.defaultProps = {
  product: null,
};

export default connect(memo(PriceInfo));
