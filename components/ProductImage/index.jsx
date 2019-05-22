import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import Image from '@shopgate/pwa-common/components/Image';
import Placeholder from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import appConfig, { themeConfig } from '@shopgate/pwa-common/helpers/config';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { PORTAL_PRODUCT_IMAGE } from '@shopgate/engage/components/constants';
import styles from './style';

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
    forcePlaceholder: PropTypes.bool,
    highestResolutionLoaded: PropTypes.func,
    ratio: PropTypes.arrayOf(PropTypes.number),
    resolutions: PropTypes.arrayOf(PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      blur: PropTypes.number,
    })),
    src: PropTypes.string,
    srcmap: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    alt: null,
    animating: true,
    forcePlaceholder: false,
    highestResolutionLoaded: () => {},
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
  };

  /**
   * Component constructor
   * @param {Object} props The component properties
   */
  constructor(props) {
    super(props);

    const showPlaceholder = !props.src && (props.srcmap === null || props.srcmap.length === 0);
    this.state = {
      showPlaceholder,
    };
  }

  /**
   * Called when the component props change.
   * @param {Object} nextProps The new component properties
   */
  componentWillReceiveProps(nextProps) {
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
   * @return {boolean} Update or not.
   */
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  /**
   * Triggered when the image could not be loaded for some reason.
   */
  imageLoadingFailed = () => {
    this.setState({
      showPlaceholder: true,
    });
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const addInnerShadow = !appConfig.hideProductImageShadow;

    if (this.state.showPlaceholder) {
      const wrapperClasses = classNames(styles.placeholderContainer, {
        [styles.innerShadow]: addInnerShadow,
      });

      // Image is not present or could not be loaded, show a placeholder.
      return (
        <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE} >
          <div className={wrapperClasses}>
            <div className={styles.placeholderContent} data-test-id="placeHolder">
              <Placeholder className={styles.placeholder} />
            </div>
          </div>
        </SurroundPortals>
      );
    }

    // Return the actual image.
    return (
      <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE}>
        <div className={addInnerShadow ? styles.innerShadow : ''}>
          <Image
            {...this.props}
            className={addInnerShadow ? styles.innerShadow : ''}
            backgroundColor={colors.light}
            onError={this.imageLoadingFailed}
          />
        </div>
      </SurroundPortals>

    );
  }
}

export default ProductImage;
