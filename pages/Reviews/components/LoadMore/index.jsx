/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'Components/ActionButton';
import I18n from '@shopgate/pwa-common/components/I18n';
import connect from './connector';
import { REVIEW_ITEMS_PER_PAGE } from '../../constants';

/**
 * Load more button for reviews list.
 */
class LoadMore extends Component {
  /**
   * Prop types.
   * @type {Object}
   */
  static propTypes = {
    fetchReviews: PropTypes.func.isRequired,
    currentReviewCount: PropTypes.number,
    isFetching: PropTypes.bool,
    productId: PropTypes.string,
    totalReviewCount: PropTypes.number,
  };

  /**
   * Default props.
   * @type {Object} Default props.
   */
  static defaultProps = {
    currentReviewCount: 0,
    isFetching: false,
    productId: null,
    totalReviewCount: 0,
  };

  /**
   * Handles click.
   */
  handleClick = () => {
    this.props.fetchReviews(
      this.props.productId,
      REVIEW_ITEMS_PER_PAGE,
      this.props.currentReviewCount
    );
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    if (
      !this.props.productId
      || this.props.currentReviewCount >= this.props.totalReviewCount
    ) {
      return null;
    }
    return (
      <ActionButton
        onClick={this.handleClick}
        loading={this.props.isFetching}
      >
        <I18n.Text string="common.load_more" />
      </ActionButton>
    );
  }
}

export default connect(LoadMore);
