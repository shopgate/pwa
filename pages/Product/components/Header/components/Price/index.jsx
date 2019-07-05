import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_PRICE,
  PRODUCT_PRICE_AFTER,
  PRODUCT_PRICE_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import PriceBase from '@shopgate/pwa-ui-shared/Price';
import { ProductContext } from '../../../../context';
import connect from './connector';
import styles from './style';
/**
 * Calculate total price to show with additions
 * @param {number} price unit amount
 * @param {Object} additions price modifiers
 * @returns {number}
 */
const getTotalPrice = (price, additions) => {
  if (!additions) {
    return price;
  }
  return price + Object.values(additions)
    .reduce((p, val) => {
      // eslint-disable-next-line no-param-reassign
      p += val;
      return p;
    }, 0);
};
/**
 * The Price component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Price = ({ price, hasProductVariants }) => (
  <Fragment>
    <Portal name={PRODUCT_PRICE_BEFORE} />
    <Portal name={PRODUCT_PRICE} props={{ price }}>
      <ProductContext.Consumer>
        {({ optionsPrices }) => (
          <PlaceholderLabel ready={(price !== null)} className={styles.placeholder}>
            {(price && typeof price.unitPrice === 'number') && (
              <PriceBase
                className={styles.price}
                currency={price.currency}
                discounted={!!price.discount}
                taxDisclaimer
                unitPrice={getTotalPrice(price.unitPrice, optionsPrices)}
                unitPriceMin={hasProductVariants ? price.unitPriceMin : 0}
              />
            )}
          </PlaceholderLabel>
        )}
      </ProductContext.Consumer>
    </Portal>
    <Portal name={PRODUCT_PRICE_AFTER} />
  </Fragment>
);

Price.propTypes = {
  hasProductVariants: PropTypes.bool,
  price: PropTypes.shape(),
};

Price.defaultProps = {
  hasProductVariants: false,
  price: null,
};

export default connect(Price);
