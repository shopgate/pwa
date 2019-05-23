import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal, CartTotalLine } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_TAX,
  CART_PAYMENT_BAR_TOTALS_TAX_BEFORE,
  CART_PAYMENT_BAR_TOTALS_TAX_AFTER,
  getTaxLine,
} from '@shopgate/engage/cart';
import CartContext from 'Pages/Cart/context';
import connect from './connector';

/**
 * The Tax component.
 * @returns {JSX}
 */
const Tax = ({ taxData }) => {
  if (!taxData) {
    return null;
  }

  return (
    <CartContext.Consumer>
      {({ currency, isLoading, config }) => {
        const taxLine = getTaxLine(config, taxData);

        if (!taxLine) {
          return null;
        }

        return (
          <Fragment>
            <Portal name={CART_PAYMENT_BAR_TOTALS_TAX_BEFORE} />
            <Portal name={CART_PAYMENT_BAR_TOTALS_TAX}>
              <CartTotalLine isDisabled={isLoading} type="tax">
                <CartTotalLine.Label label={taxLine.label} />
                <CartTotalLine.Amount amount={taxLine.amount} currency={currency} />
                <CartTotalLine.Hint hint={taxLine.hint} />
              </CartTotalLine>
            </Portal>
            <Portal name={CART_PAYMENT_BAR_TOTALS_TAX_AFTER} />
          </Fragment>
        );
      }}
    </CartContext.Consumer>
  );
};

Tax.propTypes = {
  taxData: PropTypes.shape({
    label: PropTypes.string,
    amount: PropTypes.number,
  }),
};

Tax.defaultProps = {
  taxData: null,
};

export default connect(Tax);
