/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import ReviewForm from './components/ReviewForm';

/**
 * The view that holds a review form.
 */
class WriteReview extends Component {
  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Get view title.
   */
  get title() {
    const { __ } = this.context.i18n();
    return __('titles.reviews');
  }

  /**
   * Render view
   * @return {JSX}
   */
  render() {
    return (
      <View title={this.title}>
        <ReviewForm />
      </View>
    );
  }
}

export default WriteReview;
