import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import classnames from 'classnames';
import { logger } from '@shopgate/pwa-core';
import appConfig, { themeConfig, themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';
import Image from '@shopgate/pwa-common/components/Image';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { withStyles } from '@shopgate/engage/styles';
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

/**
 * The product image component.
 * This component will behave like the core Image component with the additional
 * feature of showing a placeholder in case no src property has been passed
 * or the given source image cannot be loaded.
 */
class ProductImage extends Component {
  /**
   * See Image component manual for detailed description about the component property types.
   */
  static propTypes = {
    alt: PropTypes.string,
    animating: PropTypes.bool,
    classes: PropTypes.shape({
      innerShadow: PropTypes.string,
      placeholder: PropTypes.string,
      placeholderContainer: PropTypes.string,
      placeholderContent: PropTypes.string,
    }),
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

  static defaultProps = {
    alt: null,
    animating: true,
    className: null,
    classes: {},
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

  /**
   * Component constructor
   * @param {Object} props The component properties
   */
  constructor(props) {
    super(props);
    logger.assert(!props.srcmap, 'Use of srcmap prop is deprecated. Use resolutions instead');

    const showPlaceholder = !props.src && (props.srcmap === null || props.srcmap.length === 0);
    this.state = {
      showPlaceholder,
      imageLoadingFailed: false,
    };
  }

  /**
   * Called when the component props change.
   * @param {Object} nextProps The new component properties
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    // Disable the placeholder to give the real image a new chance to load.
    // If we do not have a src property set then just show the placeholder instead.
    const showPlaceholder = !nextProps.src && (!nextProps.srcmap || nextProps.srcmap.length === 0);
    this.setState({
      showPlaceholder,
    });
  }

  /**
   * Should component update given the new props?
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next state.
   * @return {boolean} Update or not.
   */
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  /**
   * Triggered when the image could not be loaded for some reason.
   */
  imageLoadingFailed = () => {
    this.setState({
      showPlaceholder: true,
      imageLoadingFailed: true,
    });
  };

  /**
   * Renders the component.
   * @returns {JSX.Element}
   */
  render() {
    const {
      noBackground, className, placeholderSrc,
    } = this.props;
    const classes = withStyles.getClasses(this.props);
    const { classes: ignoredClasses, ...imageProps } = this.props;
    let { showInnerShadow } = this.props.widgetSettings;

    if (typeof showInnerShadow === 'undefined') {
      showInnerShadow = !appConfig.hideProductImageShadow;
    }

    if (this.state.imageLoadingFailed || this.state.showPlaceholder) {
      // Image is not present or could not be loaded, show a placeholder.
      return (
        <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE}>
          <div
            className={classnames(classes.placeholderContainer, {
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

    // Return the actual image.
    return (
      <SurroundPortals
        portalName={PORTAL_PRODUCT_IMAGE}
        portalProps={{
          src: this.props.src,
          resolutions: this.props.resolutions,
        }}
      >
        <div className={`${className} engage__product__product-image`}>
          <Image
            {...imageProps}
            className={showInnerShadow ? classes.innerShadow : ''}
            backgroundColor={noBackground ? 'transparent' : colors.light}
            onError={this.imageLoadingFailed}
            aria-hidden={!this.props.alt}
          />
        </div>
      </SurroundPortals>
    );
  }
}

export { ProductImage as UnwrappedProductImage };

export default connect(withWidgetSettings(withStyles(
  ProductImage,
  (_, props) => ({
    placeholderContainer: {
      position: 'relative',
      width: '100%',
      ':before': {
        display: 'block',
        content: '""',
        width: '100%',
        paddingTop: `${100 * getImageRatio(props)}%`,
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
  })
), '@shopgate/engage/product/ProductImage'));
