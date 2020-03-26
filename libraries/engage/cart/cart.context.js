// @flow
import { createContext } from 'react';
import { type CartConfig } from '@shopgate/pwa-common-commerce/cart/helpers/config';

export type CartContextProps = {
  currency: string,
  config: CartConfig,
  isUserLoggedIn: boolean,
  isLoading: boolean,
  flags: { [string]: any },
  display: 'line' | 'card';
}

export const CartContext = createContext<CartContextProps>({
  currency: 'EUR',
  config: {},
  isUserLoggedIn: false,
  isLoading: false,
  flags: {},
  display: 'card',
});
