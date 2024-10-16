import { logger } from '@shopgate/pwa-core/helpers';
import { DEEPLINK_CART_ADD_PRODUCT_PATTERN } from '@shopgate/pwa-common-commerce/cart/constants';
import fetchProduct from '@shopgate/pwa-common-commerce/product/actions/fetchProduct';
import { historyPush, historyReset } from '../router';
import {
  INDEX_PATH_DEEPLINK,
  INDEX_PATH,
} from '../../constants/RoutePaths';

/**
 * @param {Object} payload The link payload.
 * @param {boolean} allowExternalLinks Wether the function should open external links or should try
 * to convert them to internal links
 * @return {Function}
 */
export default function handleLink(payload, allowExternalLinks = false) {
  return async (dispatch) => {
    let { link } = payload;

    if (!link) {
      return;
    }

    // cast to string
    link = String(link);

    let pathname;
    if (link.startsWith('http')) {
      // Link is common URL schema.
      if (allowExternalLinks) {
        dispatch(historyPush({
          pathname: link,
        }));
        return;
      }

      try {
        ({ pathname } = new URL(link));
      } catch (linkParseError) {
        logger.error(`Could not parse link ${link}`, linkParseError);
      }
    } else {
      // Remove the deeplink protocol from the link.
      pathname = link.replace(/^(.*:)(\/\/)?/, '/');

      if (!pathname.startsWith('/')) {
        // Take care that pathname starts with a slash. Otherwise routing can break
        pathname = `/${pathname}`;
      }
    }

    if (!pathname || pathname === INDEX_PATH || pathname.startsWith(INDEX_PATH_DEEPLINK)) {
      /**
       * Special treatment for the index page. To avoid multiple index pages within the history,
       * the parsed link helper will only emit the openLink events for the link to inform the
       * streams, but not open a real page. Additionally the history is reset.
       */
      dispatch(historyReset());
      return;
    }

    if (pathname.includes(DEEPLINK_CART_ADD_PRODUCT_PATTERN.split('/')[1])) {
      const [, , productId] = pathname.split('/');
      await dispatch(fetchProduct(decodeURIComponent(productId)));
    }

    dispatch(historyPush({
      pathname,
    }));
  };
}
