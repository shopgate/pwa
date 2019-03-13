import React, { Component } from 'react';
import { Swiper } from '@shopgate/pwa-common/components';

/**
 * ImageSlider component that uses the Slider for swiping functionality
 */
class ImageSlider extends Component {
  static propTypes = Swiper.propTypes;

  static defaultProps = Swiper.defaultProps;

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

    return !nextChildren.every((child, index) => child === oldChildren[index]);
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

    // Create a Slider.Item for each image
    const imageSliderItems = [];

    React.Children.forEach(this.props.children, (child, index) => {
      const key = child.key ? `${child.key}_${index}` : index;

      imageSliderItems.push((
        <Swiper.Item key={key}>
          {child}
        </Swiper.Item>
      ));
    });

    return (
      <Swiper
        {...this.props}
        classNames={this.props.classNames}
        rebuildOnUpdate
        maxIndicators={10}
      >
        {imageSliderItems}
      </Swiper>
    );
  }
}

export default ImageSlider;
