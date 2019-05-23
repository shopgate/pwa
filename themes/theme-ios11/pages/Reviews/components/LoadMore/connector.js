import { connect } from 'react-redux';
import { getCurrentBaseProductId } from '@shopgate/engage/product';

import {
  getReviewsTotalCount,
  getCurrentReviewCount,
  getReviewsFetchingState,
} from '@shopgate/engage/reviews';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  currentReviewCount: getCurrentReviewCount(state, props),
  isFetching: getReviewsFetchingState(state, props),
  productId: getCurrentBaseProductId(state, props),
  totalReviewCount: getReviewsTotalCount(state, props),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  fetchReviews: (productId, limit, offset) =>
    dispatch(fetchReviews(productId, limit, offset)),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.currentReviewCount && next.currentReviewCount) {
    return false;
  }

  if (prev.isFetching !== next.isFetching) {
    return false;
  }

  if (prev.totalReviewCount !== next.totalReviewCount) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
