import React from 'react';
import PropTypes from 'prop-types';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { getTaxLine } from '@shopgate/pwa-common-commerce/cart';
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
          <CartTotalLine isDisabled={isLoading} type="tax">
            <CartTotalLine.Label label={taxLine.label} />
            <CartTotalLine.Amount amount={taxLine.amount} currency={currency} />
            {taxLine.hint && <CartTotalLine.Hint hint={taxLine.hint} />}
          </CartTotalLine>
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
