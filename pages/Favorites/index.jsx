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
import LoadingIndicator from 'Components/LoadingIndicator';
import connect from './connector';
import EmptyFavorites from './components/EmptyFavorites';
import FavoritesList from './components/FavoritesList';
/**
 * Favorites page.
 */
class Favorites extends Component {
  static propTypes = {
    initialLoading: PropTypes.bool.isRequired,
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
   * Initial render with just a loading spinner.
   * For normal app start should never be visible since it's only rendered when redux is not yet
   * filled with favorites data.
   * Will happen only if connection is very slow and user is very fast, or opens the favorites
   * via an interjection.
   * @returns {XML}
   */
  initialRender() {
    return (
      <View title={this.title}>
        <LoadingIndicator />
      </View>
    );
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    if (this.props.initialLoading) {
      return this.initialRender();
    }
    return (
      <View title={this.title}>
        <EmptyFavorites products={this.props.products} />
        <FavoritesList products={this.props.products} />
      </View>
    );
  }
}

export default connect(Favorites);
