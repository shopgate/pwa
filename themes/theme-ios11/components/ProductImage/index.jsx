import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Image from '@shopgate/pwa-common/components/Image';
import Placeholder from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import colors from 'Styles/colors';
import styles from './style';
import ProgressiveImage from '@shopgate/pwa-common/components/ProgressiveImage';

/**
 * The product image component.
 * This component will behave like the core Image component with the additional
 * feature of showing a placeholder in case no src property has been passed
 * or the given source image cannot be loaded.
 */
class ProductImage extends Component {
  /**
   * See Image component manual for detailed description
   * about the component property types.
   */
  static propTypes = {
    alt: PropTypes.string,
    animating: PropTypes.bool,
    classNames: PropTypes.objectOf(PropTypes.string),
    forcePlaceholder: PropTypes.bool,
    highestResolutionLoaded: PropTypes.func,
    ratio: PropTypes.arrayOf(PropTypes.number),
    srcset: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    alt: null,
    animating: true,
    forcePlaceholder: false,
    classNames: {
      container: null,
      glowContainer: null,
      imageContainer: null,
    },
    highestResolutionLoaded: () => { },
    ratio: null,
    srcset: [],
  };

  /**
   * Component constructor
   * @param {Object} props The component properties
   */
  constructor(props) {
    super(props);

    const showPlaceholder = !props.srcset || props.srcset.filter(val => val).length === 0;
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
    const showPlaceholder = !nextProps.srcset || nextProps.srcset.filter(val => val).length === 0;
    this.setState({
      showPlaceholder,
    });
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Should component update given the new props?
   * @param  {Object} nextProps The next component props.
   * @return {boolean} Update or not.
   */
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  /**
   * Renders the actual content (image or placeholder).
   * @return {JSX}
   */
  get renderedContent() {
    if (this.state.showPlaceholder) {
      // Image is not present or could not be loaded, show a placeholder.
      return (
        <div className={styles.placeholderContainer}>
          <div className={styles.placeholderContent} data-test-id="placeHolder">
            <Placeholder className={styles.placeholder} />
          </div>
        </div>
      );
    }

    const classes = classNames(
      styles.container,
      this.props.classNames.container
    );

    return (
      <ProgressiveImage
        {...this.props}
        backgroundColor={colors.light}
        className={classes}
        onError={this.imageLoadingFailed}
      />
    );
  }

  /**
   * Triggered when the image could not be loaded for some reason.
   */
  imageLoadingFailed = () => {
    if (this.mounted) {
      this.setState({
        showPlaceholder: true,
      });
    }
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const classes = classNames(
      styles.container,
      this.props.classNames.imageContainer
    );

    return (
      <div className={classes}>
        {this.renderedContent}
      </div>
    );
  }
}

export default ProductImage;
