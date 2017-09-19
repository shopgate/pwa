/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import connect from './connector';
/**
 *
 */
class ReviewsList extends Component {
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
  static defaultProps ={
    reviews: [],
  };
  /**
   * Set offset to 0 for init.
   * @param {Object} props React props.
   */
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
    };
  }

  /**
   * Fetch the first reviews bundle.
   */
  componentDidMount() {
    const { productId } = this.props.params;
    this.props.fetchReviews(productId, 20, this.state.offset);
  }

  /**
   * Check is there's need to bump offset.
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.reviews.length === this.props.reviews.length) {
      return;
    }
    this.setState({
      offset: this.state.offset += 20,
    });
  }
  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    return (
      <View>
        <span>foo</span>
      </View>
    );
  }
}

export default connect(ReviewsList);
