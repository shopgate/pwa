// @flow
import * as React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_TAX,
  getTaxLine,
} from '@shopgate/pwa-common-commerce/cart';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import connect from './PaymentBarTax.connector';

type TaxData = {
  label: string;
  amount: number;
}

type Props = {
  taxData?: TaxData;
}

/**
 * The Tax component.
 * @returns {JSX}
 */
function PaymentBarTax({ taxData }: Props) {
  const { currency, isLoading, config } = React.useContext(CartContext);

  if (!taxData) {
    return null;
  }

  const taxLine = getTaxLine(config, taxData);

  if (!taxLine) {
    return null;
  }

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_TAX}>
      <CartTotalLine isDisabled={isLoading} type="tax">
        <CartTotalLine.Label label={taxLine.label} />
        <CartTotalLine.Amount amount={taxLine.amount} currency={currency} />
        <CartTotalLine.Hint hint={taxLine.hint} />
      </CartTotalLine>
    </SurroundPortals>
  );
}

PaymentBarTax.defaultProps = {
  taxData: null,
};

export default connect(PaymentBarTax);
