/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import ReviewForm from 'Components/ReviewForm';
import connect from './connector';

class WriteReview extends Component {
  static propTypes = {
    getUserReview: PropTypes.func.isRequired,
    productId: PropTypes.string,
    review: PropTypes.shape(),
  };

  static defaultProps = {
    review: null,
    productId: '',
  };

  componentDidMount() {
    const productId = this.props.productId;
    this.props.getUserReview(productId);
  }

  render() {
    return (
      <View>
        <ReviewForm review={this.props.review} />
      </View>
    );
  }
}

export default connect(WriteReview);
