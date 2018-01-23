/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import Header from 'Components/Reviews/components/Header';
import List from 'Components/Reviews/components/List';
import LoadMoreButton from './components/LoadMore';
import connect from './connector';

/**
 * All reviews page component.
 */
class Reviews extends Component {
  /**
   * Context types definition.
   * @type {{i18n: shim}}
   */
  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * PropTypes definition
   * @type {{rating: Object, reviews: (*|shim)}}
   */
  static propTypes = {
    rating: PropTypes.shape(),
    reviews: PropTypes.arrayOf(PropTypes.shape()),
  };

  /**
   *
   * @type {{rating: {}, reviews: Array}}
   */
  static defaultProps = {
    rating: {},
    reviews: [],
  };

  /**
   * A title translation string.
   * @returns {string} Title
   */
  get title() {
    const { __ } = this.context.i18n();
    return __('titles.reviews');
  }

  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    return (
      <View title={this.title}>
        <Header rating={this.props.rating} withTopGap />
        <List reviews={this.props.reviews} />
        <LoadMoreButton />
      </View>
    );
  }
}

export default connect(Reviews);
