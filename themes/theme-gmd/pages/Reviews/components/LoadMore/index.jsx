import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActionButton, I18n } from '@shopgate/engage/components';
import connect from './connector';
import { REVIEW_ITEMS_PER_PAGE } from '../../constants';

/**
 * Load more button for reviews list.
 */
class LoadMore extends Component {
  static propTypes = {
    fetchReviews: PropTypes.func.isRequired,
    currentReviewCount: PropTypes.number,
    isFetching: PropTypes.bool,
    productId: PropTypes.string,
    totalReviewCount: PropTypes.number,
  };

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
