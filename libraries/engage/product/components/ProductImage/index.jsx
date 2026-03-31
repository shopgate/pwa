import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  memo,
} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { logger } from '@shopgate/pwa-core';
import appConfig, { themeConfig, themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';
import Image from '@shopgate/pwa-common/components/Image';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { makeStyles } from '@shopgate/engage/styles';
import { withWidgetSettings } from '../../../core/hocs/withWidgetSettings';
import { PORTAL_PRODUCT_IMAGE } from '../../../components/constants';
import ProductImagePlaceholder from './ProductImagePlaceholder';
import connect from './connector';

const { colors } = themeConfig;

const placeholderIconScale = 0.65;

/**
 * Derives the image aspect ratio from explicit ratio props or the largest resolution.
 * @param {Object} props The component props.
 * @param {number[]} [props.ratio] Optional width/height ratio tuple.
 * @param {Array<{ width: number, height: number }>} props.resolutions Available image resolutions.
 * @returns {string} The computed ratio as a fixed decimal string.
 */
const getImageRatio = ({ ratio, resolutions } = {}) => {
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

const useStyles = makeStyles()((_, { ratio }) => ({
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
    color: themeColors.placeholder,
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
      boxShadow: themeShadows.productImage,
      pointerEvents: 'none',
    },
  },
}));

/**
 * The product image component.
 * This component will behave like the core Image component with the additional
 * feature of showing a placeholder in case no src property has been passed
 * or the given source image cannot be loaded.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const ProductImage = (props) => {
  const rest = omit(props, ['classes']);
  const {
    alt,
    className,
    noBackground,
    placeholderSrc,
    ratio,
    resolutions,
    src,
    srcmap,
    widgetSettings,
  } = rest;

  const ratioValue = Number.parseFloat(
    getImageRatio({
      ratio,
      resolutions,
    })
  ) || 1;
  const { classes, cx } = useStyles({ ratio: ratioValue });

  const [showPlaceholder, setShowPlaceholder] = useState(
    !src && (srcmap === null || srcmap.length === 0)
  );
  const [imageLoadingFailed, setImageLoadingFailed] = useState(false);

  useLayoutEffect(() => {
    logger.assert(
      !srcmap,
      'Use of srcmap prop is deprecated. Use resolutions instead'
    );
  /* eslint-disable-next-line react-hooks/exhaustive-deps -- legacy: assert once at mount */
  }, []);

  useEffect(() => {
    const nextShowPlaceholder = !src && (!srcmap || srcmap.length === 0);
    setShowPlaceholder(nextShowPlaceholder);
  }, [src, srcmap]);

  const imageLoadingFailedHandler = useCallback(() => {
    setShowPlaceholder(true);
    setImageLoadingFailed(true);
  }, []);

  let { showInnerShadow } = widgetSettings;

  if (typeof showInnerShadow === 'undefined') {
    showInnerShadow = !appConfig.hideProductImageShadow;
  }

  if (imageLoadingFailed || showPlaceholder) {
    return (
      <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE}>
        <div
          className={cx(classes.placeholderContainer, {
            [classes.innerShadow]: showInnerShadow,
            [className]: !!className,
          })}
        >
          { placeholderSrc ? (
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
        resolutions,
      }}
    >
      <div className={cx(className, 'engage__product__product-image')}>
        <Image
          {...rest}
          className={showInnerShadow ? classes.innerShadow : ''}
          backgroundColor={noBackground ? 'transparent' : colors.light}
          onError={imageLoadingFailedHandler}
          aria-hidden={!alt}
        />
      </div>
    </SurroundPortals>
  );
};

ProductImage.propTypes = {
  alt: PropTypes.string,
  animating: PropTypes.bool,
  classes: PropTypes.shape(),
  className: PropTypes.string,
  forcePlaceholder: PropTypes.bool,
  highestResolutionLoaded: PropTypes.func,
  noBackground: PropTypes.bool,
  placeholderSrc: PropTypes.string,
  ratio: PropTypes.arrayOf(PropTypes.number),
  resolutions: PropTypes.arrayOf(PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    blur: PropTypes.number,
  })),
  src: PropTypes.string,
  srcmap: PropTypes.arrayOf(PropTypes.string),
  widgetSettings: PropTypes.shape(),
};

ProductImage.defaultProps = {
  alt: null,
  animating: true,
  classes: {},
  className: null,
  forcePlaceholder: false,
  highestResolutionLoaded: () => { },
  noBackground: false,
  ratio: null,
  resolutions: [
    {
      width: 50,
      height: 50,
      blur: 2,
    },
    {
      width: 440,
      height: 440,
    },
  ],
  src: null,
  srcmap: null,
  placeholderSrc: null,
  widgetSettings: {},
};

export { ProductImage as UnwrappedProductImage };

export default connect(withWidgetSettings(
  memo(ProductImage),
  '@shopgate/engage/product/ProductImage'
));
