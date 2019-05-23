import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getProductRating } from '@shopgate/engage/product';
import { getProductReviews } from '@shopgate/engage/reviews';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  rating: getProductRating(state, props),
  reviews: getProductReviews(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.rating && next.rating) {
    return false;
  }

  if (!isEqual(prev.reviews, next.reviews)) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
