import React from 'react';
import PropTypes from 'prop-types';
import {
  PRODUCT_PRICE,
} from '@shopgate/engage/product/constants';
import {
  SurroundPortals,
  PlaceholderLabel,
  Price as PriceBase,
} from '@shopgate/engage/components';
import { ProductContext } from '@shopgate/engage/product/contexts';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()({
  placeholder: {
    height: 20,
    width: '50px',
    display: 'inline-block',
  },
  price: {
    fontSize: '1.25rem',
    justifyContent: 'flex-end',
    lineHeight: 1,
  },
});

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
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Content = ({ price, hasProductVariants }) => {
  const { classes } = useStyles();

  return (
    <ProductContext.Consumer>
      {({ optionsPrices }) => (
        <PlaceholderLabel ready={(price !== null)} className={classes.placeholder}>
          {(price && typeof price.unitPrice === 'number') && (
          <PriceBase
            className={classes.price}
            currency={price.currency}
            discounted={!!price.discount}
            taxDisclaimer
            unitPrice={getTotalPrice(price.unitPrice, optionsPrices)}
            unitPriceMin={hasProductVariants ? price.unitPriceMin : 0}
            unitPriceMax={hasProductVariants ? price.unitPriceMax : undefined}
          />
          )}
        </PlaceholderLabel>
      )}
    </ProductContext.Consumer>
  );
};

Content.propTypes = {
  hasProductVariants: PropTypes.bool,
  price: PropTypes.shape(),
};

Content.defaultProps = {
  hasProductVariants: false,
  price: null,
};

/**
 * The Price component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Price = props => (
  <SurroundPortals portalName={PRODUCT_PRICE} portalProps={props}>
    <Content {...props} />
  </SurroundPortals>
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
