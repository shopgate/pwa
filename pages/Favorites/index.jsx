/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import connect from './connector';
import EmptyFavorites from './components/EmptyFavorites';

/**
 * Favorites page.
 */
class Favorites extends Component {
  static propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Title getter.
   */
  get title() {
    const { __ } = this.context.i18n();
    return __('titles.favorites');
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    return (
      <View title={this.title}>
        <EmptyFavorites products={this.props.products} />
      </View>
    );
  }
}

export default connect(Favorites);
