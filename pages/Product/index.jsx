/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import Reviews from 'Components/Reviews';
import ImageSlider from './components/ImageSlider';
import Header from './components/Header';
import VariantSelects from './components/VariantSelects';
import Options from './components/Options';
import Description from './components/Description';
import Properties from './components/Properties';
import connect from './connector';

/**
 * The product component.
 */
class Product extends Component {
  static propTypes = {
    resetCurrentProduct: PropTypes.func.isRequired,
    name: PropTypes.string,
  };

  static defaultProps = {
    name: null,
  };

  /**
   * Component will unmount and reset the current product.
   */
  componentWillUnmount() {
    this.props.resetCurrentProduct();
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <View title={this.props.name}>
        <ImageSlider />
        <Header />
        <VariantSelects />
        <Options />
        <Description />
        <Properties />
        <Reviews />
      </View>
    );
  }
}

export default connect(Product);
