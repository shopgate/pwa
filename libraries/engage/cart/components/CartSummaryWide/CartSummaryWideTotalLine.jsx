import React, { useContext } from 'react';
import classNames from 'classnames';
import { I18n } from '@shopgate/engage/components';
import { CartContext } from '../../cart.context';
import { container, disabled } from './CartSummaryWideTotalLine.style';

type Props = {
  className?: string,
  label: string,
  amount: number,
}

/**
 * @param {Object} props The component props
 * @return {JSX}
 */
const CartSummaryWideTotalLine = ({ label, amount, className }: Props) => {
  const { currency, isLoading } = useContext(CartContext);

  if (!amount) {
    return null;
  }

  const classes = classNames(container, className, {
    [disabled]: isLoading,
  });

  return (
    <div className={classes}>
      <I18n.Text string={label} />
      <span>
        <I18n.Price price={amount} currency={currency} />
      </span>
    </div>
  );
};

CartSummaryWideTotalLine.defaultProps = {
  className: null,
};

export default CartSummaryWideTotalLine;
