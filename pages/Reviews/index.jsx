/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import View from 'Components/View';
import List from 'Components/Reviews/components/List';
import LoadMoreButton from './components/LoadMore';
import connect from './connector';
import { REVIEW_ITEMS_PER_PAGE } from './constants';

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
   * @return {{fetchReviews: (*|shim)}}
   */
  static propTypes = {
    fetchReviews: PropTypes.func.isRequired,
    params: PropTypes.shape().isRequired,
    reviews: PropTypes.arrayOf(PropTypes.shape()),
  };

  /**
   * Reviews are empty array as default.
   * @return {{reviews: Array}}
   */
  static defaultProps = {
    reviews: [],
  };

  /**
   * Fetch the first reviews bundle.
   */
  componentDidMount() {
    const { productId } = this.props.params;
    // ProductId comes from url here, need to encode it first.
    this.props.fetchReviews(hex2bin(productId), REVIEW_ITEMS_PER_PAGE, 0);
  }

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
        <List reviews={this.props.reviews}/>
        <LoadMoreButton/>
      </View>
    );
  }
}

export default connect(Reviews);
