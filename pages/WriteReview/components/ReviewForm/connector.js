import { connect } from 'react-redux';
import { getUserDisplayName } from '@shopgate/pwa-common/selectors/user';
import submitReview from '@shopgate/pwa-common-commerce/reviews/actions/submitReview';
import {
  getUserReviewForProduct,
  getUserReviewFirstFetchState,
} from '@shopgate/pwa-common-commerce/reviews/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  authorName: getUserDisplayName(state),
  review: getUserReviewForProduct(state, props),
  isLoadingUserReview: getUserReviewFirstFetchState(state, props),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  submit: (review, update) => dispatch(submitReview(review, update)),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.authorName !== next.authorName) {
    return false;
  }

  if (prev.isLoadingUserReview !== next.isLoadingUserReview) {
    return false;
  }

  if (prev.review.author !== next.review.author) {
    return false;
  }

  if (prev.review.rate !== next.review.rate) {
    return false;
  }

  if (prev.review.review !== next.review.review) {
    return false;
  }

  if (prev.review.title !== next.review.title) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
