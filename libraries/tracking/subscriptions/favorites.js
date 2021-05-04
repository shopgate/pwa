import { favoritesDidAddItem$ } from '@shopgate/pwa-common-commerce/favorites/streams';
import getPage from '../selectors/page';
import { track } from '../helpers/index';
import { getProductFormatted } from '../selectors/product';

/**
 * Favorites tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function favorites(subscribe) {
  subscribe(favoritesDidAddItem$, ({ getState, action }) => {
    const state = getState();
    const page = getPage(state);

    let { productId } = action;
    productId = [].concat(productId); // cast to array

    const favouriteListProducts = productId.map((id) => {
      const product = getProductFormatted(state, { productId: id });

      return {
        ...product,
        // eslint-disable-next-line camelcase
        unit_amount_net: product.amount.net * 100,
        // eslint-disable-next-line camelcase
        unit_amount_with_tax: product.amount.gross * 100,
        // eslint-disable-next-line camelcase
        currency_id: product.amount.currency,
      };
    });

    track('addToWishlist', {
      page,
      favouriteListProducts,
    }, state);
  });
}
