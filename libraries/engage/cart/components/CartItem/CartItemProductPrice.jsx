// @flow
import * as React from 'react';
import classNamesMod from 'classnames';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_ITEM_PRICE_STRIKED,
  CART_ITEM_PRICE,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import { useCartItemProduct } from './CartItem.hooks';
import { priceStriked, price as priceStyle } from './CartItemProductPrice.style';

type ClassNames = {
  price?: string | null,
  priceStriked?: string | null,
}

type Props = {
  defaultPrice: number,
  specialPrice?: number | null,
  classNames?: ClassNames
}

/**
 * The Cart Product Price component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function CartItemProductPrice(props: Props) {
  const {
    defaultPrice, specialPrice, classNames,
  } = props;
  const context = useCartItemProduct();
  const { currency } = context;

  const hasStrikePrice = typeof specialPrice === 'number' && specialPrice !== defaultPrice;
  const price = hasStrikePrice ? specialPrice : defaultPrice;

  return (
    <React.Fragment>
      {hasStrikePrice && (
        <SurroundPortals portalName={CART_ITEM_PRICE_STRIKED} portalProps={context}>
          <PriceStriked
            className={classNamesMod(priceStriked, classNames?.priceStriked)}
            value={defaultPrice}
            currency={currency}
          />
        </SurroundPortals>
      )}
      <SurroundPortals portalName={CART_ITEM_PRICE} portalProps={context}>
        <Price
          className={classNamesMod(priceStyle, classNames?.price)}
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
  classNames: {
    price: null,
    priceStriked: null,
  },
};
