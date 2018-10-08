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

export default connect(mapStateToProps, mapDispatchToProps);
