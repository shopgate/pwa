// @flow
import * as React from 'react';
import PT from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_ITEM_PRICE_STRIKED,
  CART_ITEM_PRICE,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import { priceStriked, price as priceStyle } from './CartItemProductPrice.style';

type Props = {
  currency: string,
  defaultPrice: number,
  specialPrice?: number | null,
}

type ContextProps = {
  cartItemId: string,
  type: string,
}

/**
 * The Cart Product Price component.
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
export function CartItemProductPrice(props: Props, context: ContextProps) {
  const { currency, defaultPrice, specialPrice } = props;
  const hasStrikePrice = typeof specialPrice === 'number';
  const price = hasStrikePrice ? specialPrice : defaultPrice;

  return (
    <React.Fragment>
      {hasStrikePrice && (
        <SurroundPortals portalName={CART_ITEM_PRICE_STRIKED} portalProps={context}>
          <PriceStriked
            className={priceStriked}
            value={defaultPrice}
            currency={currency}
          />
        </SurroundPortals>
      )}
      <SurroundPortals portalName={CART_ITEM_PRICE} portalProps={context}>
        <Price
          className={priceStyle}
          currency={currency}
          discounted={hasStrikePrice}
          taxDisclaimer
          unitPrice={price}
        />
      </SurroundPortals>
    </React.Fragment>
  );
}

CartItemProductPrice.defaultProps = {
  specialPrice: null,
};

CartItemProductPrice.contextTypes = {
  cartItemId: PT.string,
  type: PT.string,
};
