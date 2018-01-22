/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import Image from '@shopgate/pwa-common/components/Image';
import BackButton from './components/BackButton';
import ZoomPanSlider from './components/ZoomPanSlider';
import connect from './connector';
import styles from './style';

/**
 * The product images component.
 */
class ProductGallery extends Component {
  static propTypes = {
    disableNavigator: PropTypes.func.isRequired,
    enableNavigator: PropTypes.func.isRequired,
    getProductImages: PropTypes.func.isRequired,
    params: PropTypes.shape().isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    initialSlide: PropTypes.number,
    product: PropTypes.shape(),
  };

  static defaultProps = {
    images: null,
    initialSlide: 0,
    product: null,
  };

  /**
   * ComponentDidMount lifecycle hook. Will disable the navigator and request the images.
   */
  componentDidMount() {
    this.props.disableNavigator();
    this.props.getProductImages();
  }

  /**
   * ComponentWillUnmount lifecycle hook. Will enable the navigator.
   */
  componentWillUnmount() {
    this.props.enableNavigator();
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const title = this.props.product ? this.props.product.name : '';
    const initialSlide = this.props.params.initialSlide ?
      parseInt(this.props.params.initialSlide, 10)
      : 0;
    const resolutions = [
      {
        width: 440,
        height: 440,
      },
      {
        width: 2048,
        height: 2048,
      },
    ];

    return (
      <View title={title} hasNavigator={false}>
        <div className={styles.navButton}>
          <BackButton />
        </div>
        <div className={styles.container}>
          {this.props.images && (
            <ZoomPanSlider
              classNames={styles.sliderStyles}
              className={styles.slider}
              initialSlide={initialSlide}
              indicators
              loop
            >
              {this.props.images.map(imageSrc => (
                <div className={styles.slide} key={imageSrc}>
                  <Image src={imageSrc} resolutions={resolutions} />
                </div>
              ))}
            </ZoomPanSlider>
          )}
        </div>
      </View>
    );
  }
}

export default connect(ProductGallery);
