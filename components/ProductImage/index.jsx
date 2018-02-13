/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Image from '@shopgate/pwa-common/components/Image';
import Placeholder from 'Components/icons/PlaceholderIcon';
import styles from './style';

/**
 * The product image component.
 * This component will behave like the core Image component with the additional
 * feature of showing a placeholder in case no src property has been passed
 * or the given source image cannot be loaded.
 */
class ProductImage extends Component {

  /* eslint-disable react/no-unused-prop-types */
  /**
   * See Image component manual for detailed description about the component property types.
   */
  static propTypes = {
    alt: PropTypes.string,
    animating: PropTypes.bool,
    forcePlaceholder: PropTypes.bool,
    highestResolutionLoaded: PropTypes.func,
    ratio: PropTypes.arrayOf(PropTypes.number),
    resolutions: PropTypes.arrayOf(
      PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        blur: PropTypes.number,
      })
    ),
    src: PropTypes.string,
  };
  /* eslint-enable react/no-unused-prop-types */

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
  };

  /**
   * Component constructor
   * @param {Object} props The component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      showPlaceholder: props.src === null,
    };
  }

  state = {
    showPlaceholder: false,
  };

  /**
   * Called when the component props change.
   * @param {Object} nextProps The new component properties
   */
  componentWillReceiveProps(nextProps) {
    // Disable the placeholder to give the real image a new chance to load.
    // If we do not have a src property set then just show the placeholder instead.
    this.setState({
      showPlaceholder: nextProps.src === null,
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
    if (this.state.showPlaceholder) {
      // Image is not present or could not be loaded, show a placeholder.
      return (
        <div className={styles.placeholderContainer}>
          <div className={styles.placeholderContent}>
            <Placeholder className={styles.placeholder} />
          </div>
        </div>
      );
    }

    // Return the actual image.
    return (
      <Image {...this.props} onError={this.imageLoadingFailed} />
    );
  }
}

export default ProductImage;
