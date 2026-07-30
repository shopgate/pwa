import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { logger } from '@shopgate/pwa-core';
import Image from '@shopgate/pwa-common/components/Image';
import type { ImageProps } from '@shopgate/pwa-common/components/Image';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { makeStyles, useTheme } from '@shopgate/engage/styles';
import { useProductImageSettings } from '@shopgate/engage/settings/hooks';
import type {
  ImageResolution,
  ProductImageContext,
} from '@shopgate/engage/settings/types/appSettings';
import { PORTAL_PRODUCT_IMAGE } from '../../../components/constants';
import ProductImagePlaceholder from './ProductImagePlaceholder';
import { useProductImageShadow } from './hooks';
import connect from './connector';

const placeholderIconScale = 0.65;

/**
 * The product image context applied when a caller passes neither a context nor explicit
 * resolutions. Matches the surface most product images are rendered on.
 */
const DEFAULT_PRODUCT_IMAGE_CONTEXT: ProductImageContext = 'list';

/**
 * The resolutions and aspect ratio the image is finally rendered with, whether they came from
 * props or from the app settings.
 */
interface ResolvedImage {
  /**
   * The ladder to request, ordered ascending.
   */
  resolutions: ImageResolution[];
  /**
   * Width and height parts, or null to derive one from the largest resolution.
   */
  ratio: number[] | null;
}

/**
 * Everything the underlying Image accepts is forwarded, minus the two props this component owns:
 * it derives `backgroundColor` from `noBackground`, and takes `onError` over to swap in the
 * placeholder when loading fails.
 */
export interface ProductImageProps extends Omit<ImageProps, 'backgroundColor' | 'onError'> {
  /**
   * The surface this image is rendered on. Determines the resolutions and aspect ratio, which are
   * configured app wide. Ignored when an explicit `resolutions` prop is passed.
   */
  context?: ProductImageContext | null;
  /**
   * Drops the background behind the image.
   */
  noBackground?: boolean;
  /**
   * Image to show instead of the placeholder icon. Injected from the store.
   */
  placeholderSrc?: string | null;
  /**
   * @deprecated Pass a `context` instead, so the image follows the configured aspect ratio.
   */
  ratio?: number[] | null;
  /**
   * @deprecated Pass a `context` instead, so the image follows the configured aspect ratio.
   * Still honored, and still takes precedence over `context`.
   */
  resolutions?: ImageResolution[];
}

/**
 * Derives the image aspect ratio from an explicit ratio or the largest resolution.
 * @param resolved The resolutions and ratio the image renders with.
 * @param resolved.ratio Width and height parts, when one is configured.
 * @param resolved.resolutions The ladder the image is requested at.
 * @returns The computed ratio as a fixed decimal string.
 */
const getImageRatio = ({ ratio, resolutions }: Partial<ResolvedImage> = {}): string => {
  if (Array.isArray(ratio) && ratio.length === 2 && ratio[0]) {
    const [x, y] = ratio;
    return ((y / x)).toFixed(3);
  }

  if (Array.isArray(resolutions) && resolutions.length > 0) {
    const { width, height } = resolutions[resolutions.length - 1];

    if (width && height) {
      return ((height / width)).toFixed(3);
    }
  }

  return '1.000';
};

const useStyles = makeStyles<{ ratio: number }>()((theme, { ratio }) => ({
  placeholderContainer: {
    position: 'relative',
    width: '100%',
    ':before': {
      display: 'block',
      content: '""',
      width: '100%',
      paddingTop: `${100 * ratio}%`,
    },
  },
  placeholderContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    textAlign: 'center',
  },
  placeholder: {
    position: 'absolute',
    width: `${placeholderIconScale * 100}% !important`,
    height: `${placeholderIconScale * 100}% !important`,
    top: `${(1.0 - placeholderIconScale) * 50}%`,
    left: `${(1.0 - placeholderIconScale) * 50}%`,
    color: theme.palette.background.emphasized,
  },
  innerShadow: {
    position: 'relative',
    overflow: 'hidden',
    ':after': {
      display: 'block',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      boxShadow: 'inset 0 0 20px rgba(0, 0, 0, .05)',
      pointerEvents: 'none',
    },
  },
}));

/**
 * The product image component.
 * This component will behave like the core Image component with the additional
 * feature of showing a placeholder in case no src property has been passed
 * or the given source image cannot be loaded.
 * @param props The component props.
 * @returns The rendered component.
 */
const ProductImage = (props: ProductImageProps) => {
  const {
    alt = null,
    className = null,
    context = null,
    noBackground = false,
    placeholderSrc = null,
    ratio = null,
    resolutions = null,
    src = null,
  } = props;

  const productImageSettings = useProductImageSettings();

  // An explicit resolutions prop always wins over the configured ratio, so nothing an extension
  // renders today changes behavior. The context is only consulted when nothing was passed in.
  const resolved = useMemo<ResolvedImage>(() => {
    if (resolutions) {
      return {
        resolutions,
        ratio,
      };
    }

    return productImageSettings[context || DEFAULT_PRODUCT_IMAGE_CONTEXT];
  }, [context, productImageSettings, ratio, resolutions]);

  useLayoutEffect(() => {
    logger.assert(
      !(resolutions && context),
      'ProductImage received both "resolutions" and "context". The explicit resolutions win - drop one of them.'
    );
    /* eslint-disable-next-line react-hooks/exhaustive-deps -- legacy: assert once at mount */
  }, []);

  const ratioValue = Number.parseFloat(getImageRatio(resolved)) || 1;
  const { classes, cx } = useStyles({ ratio: ratioValue });
  const theme = useTheme();
  const [showPlaceholder, setShowPlaceholder] = useState(!src);
  const [imageLoadingFailed, setImageLoadingFailed] = useState(false);

  useEffect(() => {
    setShowPlaceholder(!src);
  }, [src]);

  const imageLoadingFailedHandler = useCallback(() => {
    setShowPlaceholder(true);
    setImageLoadingFailed(true);
  }, []);

  const showInnerShadow = useProductImageShadow();

  if (imageLoadingFailed || showPlaceholder) {
    return (
      <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE}>
        <div
          className={cx(classes.placeholderContainer, {
            [classes.innerShadow]: showInnerShadow,
          }, className)}
        >
          {placeholderSrc ? (
            <ProductImagePlaceholder
              src={placeholderSrc}
              showInnerShadow={showInnerShadow}
              noBackground={noBackground}
            />
          ) : (
            <div aria-hidden className={classes.placeholderContent} data-test-id="placeHolder">
              <PlaceholderIcon className={classes.placeholder} />
            </div>
          )}
        </div>
      </SurroundPortals>
    );
  }

  return (
    <SurroundPortals
      portalName={PORTAL_PRODUCT_IMAGE}
      portalProps={{
        src,
        resolutions: resolved.resolutions,
        ratio: resolved.ratio,
      }}
    >
      <div className={cx(className, 'engage__product__product-image')}>
        <Image
          {...props}
          resolutions={resolved.resolutions}
          ratio={resolved.ratio}
          className={showInnerShadow ? classes.innerShadow : ''}
          backgroundColor={noBackground ? 'transparent' : theme.palette.background.surface}
          onError={imageLoadingFailedHandler}
          aria-hidden={!alt}
        />
      </div>
    </SurroundPortals>
  );
};

export { ProductImage as UnwrappedProductImage };

export default connect(memo(ProductImage));
