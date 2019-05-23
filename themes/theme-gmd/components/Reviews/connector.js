import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getProductReviewsExcerpt } from '@shopgate/engage/reviews';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  reviews: getProductReviewsExcerpt(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.reviews && next.reviews) {
    return false;
  }

  if (!isEqual(prev.reviews, next.reviews)) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
