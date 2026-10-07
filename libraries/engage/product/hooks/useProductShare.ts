import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import shareItem from '@shopgate/pwa-core/commands/shareItem';
import { hasSGJavaScriptBridge, hasWebBridgeCore } from '@shopgate/pwa-core/helpers';
import { getProductActionButtons } from '@shopgate/engage/settings/selectors/appSettings';
import { getProduct } from '../selectors/catalog';

export interface ProductShareParams {
  title: string;
  imageURL: string;
  deepLink: string;
}

const LEGACY_IMAGE_HOST = 'https://img-cdn.shopgate.com';
const LEGACY_IMAGE_SIZE = '880';

/**
 * Adds the size parameters that images of the legacy image service need.
 * @param url The image url.
 * @returns The image url to share.
 */
export const getShareImageUrl = (url?: string): string => {
  if (!url) {
    return '';
  }

  if (!url.startsWith(LEGACY_IMAGE_HOST)) {
    return url;
  }

  try {
    const imageUrl = new URL(url);
    imageUrl.searchParams.set('w', LEGACY_IMAGE_SIZE);
    imageUrl.searchParams.set('h', LEGACY_IMAGE_SIZE);
    return imageUrl.toString();
  } catch (error) {
    return url;
  }
};

/**
 * Shares a product with the native share sheet of the app, or of the browser outside of the app.
 * @param productId The id of the product.
 * @returns Whether the share button is switched on, whether the product can be shared and the share
 * function.
 */
const useProductShare = (productId: string | null) => {
  const product = useSelector((state: unknown) => getProduct(state, { productId }));
  const { showShareButton } = useSelector(getProductActionButtons);

  const params = useMemo<ProductShareParams | null>(() => {
    if (!product?.productUrl) {
      return null;
    }

    return {
      title: product.name || '',
      imageURL: getShareImageUrl(product.featuredImageUrl),
      deepLink: product.productUrl,
    };
  }, [product]);

  const share = useCallback(() => {
    if (!params) {
      return;
    }

    const isApp = hasSGJavaScriptBridge() && !hasWebBridgeCore();

    if (!isApp && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      navigator.share({
        title: params.title,
        url: params.deepLink,
      }).catch(() => null);
      return;
    }

    shareItem(params);
  }, [params]);

  return {
    enabled: showShareButton,
    canShare: !!params,
    share,
  };
};

export default useProductShare;
