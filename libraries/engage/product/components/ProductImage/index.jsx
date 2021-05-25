import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import classnames from 'classnames';
import { logger } from '@shopgate/pwa-core';
import appConfig, { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Image from '@shopgate/pwa-common/components/Image';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { withWidgetSettings } from '../../../core/hocs/withWidgetSettings';
import { PORTAL_PRODUCT_IMAGE } from '../../../components/constants';
import ProductImagePlaceholder from './ProductImagePlaceholder';
import styles from './style';
import connect from './connector';

const { colors } = themeConfig;

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
    'aria-hidden': PropTypes.bool,
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
    'aria-hidden': null,
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
   * Sets the image ratio based on width and height.
   * @return {number} The image ratio.
   */
  getImageRatio = () => {
    if (this.props.ratio) {
      const [x, y] = this.props.ratio;
      return ((y / x)).toFixed(3);
    }

    const { width, height } = this.props.resolutions[this.props.resolutions.length - 1];
    return ((height / width)).toFixed(3);
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      noBackground, className, placeholderSrc,
    } = this.props;
    let { showInnerShadow } = this.props.widgetSettings;

    if (typeof showInnerShadow === 'undefined') {
      showInnerShadow = !appConfig.hideProductImageShadow;
    }

    if (this.state.imageLoadingFailed || this.state.showPlaceholder) {
      // Image is not present or could not be loaded, show a placeholder.
      return (
        <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE}>
          <div
            className={classnames(styles.placeholderContainer(this.getImageRatio()), {
              [styles.innerShadow]: showInnerShadow,
              [className]: !!className,
            })}
            aria-hidden={this.props['aria-hidden']}
          >
            { placeholderSrc ? (
              <ProductImagePlaceholder
                src={placeholderSrc}
                showInnerShadow={showInnerShadow}
                noBackground={noBackground}
              />
            ) : (
              <div className={styles.placeholderContent} data-test-id="placeHolder">
                <PlaceholderIcon className={styles.placeholder} />
              </div>
            )}

          </div>
        </SurroundPortals>
      );
    }

    // Return the actual image.
    return (
      <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE}>
        <div aria-hidden={this.props['aria-hidden']} className={className}>
          <Image
            {...this.props}
            className={showInnerShadow ? styles.innerShadow : ''}
            backgroundColor={noBackground ? 'transparent' : colors.light}
            onError={this.imageLoadingFailed}
          />
        </div>
      </SurroundPortals>
    );
  }
}

export { ProductImage as UnwrappedProductImage };

export default connect(withWidgetSettings(ProductImage, '@shopgate/engage/product/ProductImage'));
