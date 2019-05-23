import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { Portal } from '@shopgate/engage/components';
import {
  PRODUCT_PRICE_INFO,
  PRODUCT_PRICE_INFO_AFTER,
  PRODUCT_PRICE_INFO_BEFORE,
} from '@shopgate/engage/product';
import { PlaceholderLabel } from '@shopgate/engage/components';
import PriceInfoBase from '@shopgate/pwa-ui-shared/PriceInfo';
import connect from './connector';
import styles from './style';

/**
 * The PriceInfo component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PriceInfo = ({ price }) => (
  <Fragment>
    <Portal name={PRODUCT_PRICE_INFO_BEFORE} />
    <Portal name={PRODUCT_PRICE_INFO}>
      <PlaceholderLabel ready={(price !== null)} className={styles.placeholder}>
        {(price && price.info !== '') && (
          <PriceInfoBase className={styles.priceInfo} text={price.info} />
        )}
      </PlaceholderLabel>
    </Portal>
    <Portal name={PRODUCT_PRICE_INFO_AFTER} />
  </Fragment>
);

PriceInfo.propTypes = {
  price: PropTypes.shape(),
};

PriceInfo.defaultProps = {
  price: '',
};

export default connect(pure(PriceInfo));
