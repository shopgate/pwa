import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_PRICE,
  PRODUCT_PRICE_AFTER,
  PRODUCT_PRICE_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import PriceBase from '@shopgate/pwa-ui-shared/Price';
import connect from './connector';
import styles from './style';

/**
 * The Price component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Price = ({ showTotalPrice, price }) => (
  <Fragment>
    <Portal name={PRODUCT_PRICE_BEFORE} />
    <Portal name={PRODUCT_PRICE}>
      <PlaceholderLabel ready={(price !== null)} className={styles.placeholder}>
        {(price && typeof price.unitPrice === 'number') && (
          <PriceBase
            className={styles.price}
            currency={price.currency}
            discounted={!!price.discount}
            taxDisclaimer
            unitPrice={!showTotalPrice ? price.unitPrice : price.totalPrice}
            unitPriceMin={!showTotalPrice ? price.unitPriceMin : 0}
          />
        )}
      </PlaceholderLabel>
    </Portal>
    <Portal name={PRODUCT_PRICE_AFTER} />
  </Fragment>
);

Price.propTypes = {
  price: PropTypes.shape(),
  showTotalPrice: PropTypes.bool,
};

Price.defaultProps = {
  price: null,
  showTotalPrice: false,
};

export default connect(pure(Price));
