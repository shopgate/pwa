import { connect } from 'react-redux';
import { getProductRating } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { getProductReviewsExcerpt } from '@shopgate/pwa-common-commerce/reviews/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  reviews: getProductReviewsExcerpt(state, props),
  rating: getProductRating(state, props),
});

export default connect(mapStateToProps);
