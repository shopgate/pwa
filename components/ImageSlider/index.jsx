/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from '@shopgate/pwa-common/components/Slider';
import defaultStyles from './style';

/**
 * ImageSlider component that uses the Slider for swiping functionality
 */
class ImageSlider extends Component {
  static propTypes = {
    ...Slider.propTypes,
    classNames: PropTypes.shape(),
  };

  static defaultProps = {
    ...Slider.defaultProps,
    classNames: {},
  };

  /**
   * This component should only render if children change
   * @param {Object} nextProps updated props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    const nextChildren = React.Children.toArray(nextProps.children);
    const oldChildren = React.Children.toArray(this.props.children);

    if (oldChildren.length !== nextChildren.length || nextProps.disabled !== this.props.disabled) {
      return true;
    }

    return nextChildren.every((child, index) => child === oldChildren[index]);
  }

  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    // No slider if there is only one image
    if (React.Children.count(this.props.children) === 1) {
      return React.Children.toArray(this.props.children).pop();
    }

    // Extend default styles if wanted
    const styles = {
      ...defaultStyles,
      ...this.props.classNames,
    };

    // Create a Slider.Item for each image
    const imageSliderItems = [];

    React.Children.forEach(this.props.children, (child, index) => {
      imageSliderItems.push((
        <Slider.Item key={index}>
          {child}
        </Slider.Item>
      ));
    });

    return (
      <Slider
        {...this.props}
        classNames={styles}
        maxIndicators={10}
      >
        {imageSliderItems}
      </Slider>
    );
  }
}

export default ImageSlider;
