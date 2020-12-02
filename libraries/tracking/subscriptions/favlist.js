import { favoritesDidAddItem$ } from '@shopgate/pwa-common-commerce/favorites/streams';
import getPage from '../selectors/page';
import { track } from '../helpers/index';
import { getProductFormatted } from '../selectors/product';

/**
 * Favlist tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function favlist(subscribe) {
  subscribe(favoritesDidAddItem$, ({ getState, action }) => {
    const state = getState();
    const product = getProductFormatted(state, { productId: action.productId });
    const page = getPage(state);

    const productFavlist = {
      ...product,
      // eslint-disable-next-line camelcase
      unit_amount_net: product.amount.net,
      // eslint-disable-next-line camelcase
      unit_amount_with_tax: product.amount.gross,
      // eslint-disable-next-line camelcase
      currency_id: product.amount.currency,
    };

    track('addToWishlist', {
      page,
      favouriteListProducts: [
        productFavlist,
      ],
    }, state);
  });
}
