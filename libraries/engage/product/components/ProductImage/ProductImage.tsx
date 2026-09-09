import { useLayoutEffect, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import { logger } from '@shopgate/pwa-core';
import Image from '@shopgate/pwa-common/components/Image';
import type { ImageProps } from '@shopgate/pwa-common/components/Image';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { makeStyles, useTheme } from '@shopgate/engage/styles';
import { useProductImageSettings } from '@shopgate/engage/settings/hooks';
import { getProductImagePlaceholder } from '@shopgate/engage/settings/selectors/shopSettings';
import type {
  ImageResolution,
  ProductImageContext,
} from '@shopgate/engage/settings/types/appSettings';
import { PORTAL_PRODUCT_IMAGE } from '../../../components/constants';
import ProductImagePlaceholder from './ProductImagePlaceholder';
import { useProductImageShadow } from './hooks';

const placeholderIconScale = 0.65;

/**
 * The context applied when a caller passes neither a context nor explicit resolutions.
 */
const DEFAULT_PRODUCT_IMAGE_CONTEXT: ProductImageContext = 'list';

/**
 * The resolutions and aspect ratio the image is rendered with.
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
 * Everything the underlying Image accepts is forwarded, minus the two this component owns:
 * `backgroundColor`, derived from `noBackground`, and `placeholder`.
 */
export interface ProductImageProps extends Omit<ImageProps, 'backgroundColor' | 'placeholder'> {
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
   * Image to show instead of the placeholder icon. The shop wide setting wins over this.
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

const useStyles = makeStyles()(theme => ({
  rounded: {
    borderRadius: theme.components.productImage.borderRadius,
    overflow: 'hidden',
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
 *
 * Behaves like the core Image component, with a product placeholder for a missing or failed image.
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

  // An explicit resolutions prop wins over the context, which is only consulted without one.
  const resolved = useMemo<ResolvedImage>(() => {
    if (resolutions) {
      return {
        resolutions,
        ratio,
      };
    }

    return productImageSettings[context || DEFAULT_PRODUCT_IMAGE_CONTEXT]
      ?? productImageSettings[DEFAULT_PRODUCT_IMAGE_CONTEXT];
  }, [context, productImageSettings, ratio, resolutions]);

  useLayoutEffect(() => {
    logger.assert(
      !(resolutions && context),
      'ProductImage received both "resolutions" and "context". The explicit resolutions win - drop one of them.'
    );
    /* eslint-disable-next-line react-hooks/exhaustive-deps -- legacy: assert once at mount */
  }, []);

  const { classes, cx } = useStyles();
  const theme = useTheme();
  const showInnerShadow = useProductImageShadow();

  const isRounded = (context || DEFAULT_PRODUCT_IMAGE_CONTEXT) === 'list';

  // Image decides when to show this.
  const placeholder = placeholderSrc ? (
    <ProductImagePlaceholder
      src={placeholderSrc}
      showInnerShadow={showInnerShadow}
      noBackground={noBackground}
    />
  ) : (
    <div aria-hidden className={classes.placeholderContent} data-test-id="placeHolder">
      <PlaceholderIcon className={classes.placeholder} />
    </div>
  );

  return (
    <SurroundPortals
      portalName={PORTAL_PRODUCT_IMAGE}
      portalProps={src ? {
        src,
        resolutions: resolved.resolutions,
        ratio: resolved.ratio,
      } : undefined}
    >
      <div className={cx(isRounded && classes.rounded, className, 'engage__product__product-image')}>
        <Image
          {...props}
          resolutions={resolved.resolutions}
          ratio={resolved.ratio}
          placeholder={placeholder}
          className={showInnerShadow ? classes.innerShadow : ''}
          backgroundColor={noBackground ? 'transparent' : theme.palette.common.white}
          aria-hidden={!alt}
        />
      </div>
    </SurroundPortals>
  );
};

export { ProductImage as UnwrappedProductImage };

/**
 * Supplies the shop wide placeholder image.
 * @param props The component props.
 * @returns The rendered component.
 */
const ConnectedProductImage = (props: ProductImageProps) => {
  // The shop wide placeholder takes precedence over a passed one.
  const placeholderSrc = useSelector(getProductImagePlaceholder) ?? props.placeholderSrc ?? null;

  return <ProductImage {...props} placeholderSrc={placeholderSrc} />;
};

export default memo(ConnectedProductImage);
