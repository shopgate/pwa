import React from 'react';
import PropTypes from 'prop-types';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
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

  const { label, amount } = taxData;
  return (
    <CartContext.Consumer>
      {({ currency, isLoading }) => (
        <CartTotalLine isDisabled={isLoading} type="tax">
          <CartTotalLine.Label label={label} />
          <CartTotalLine.Amount amount={amount} currency={currency} />
        </CartTotalLine>
      )}
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
