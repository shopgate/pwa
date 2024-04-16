import { connect } from 'react-redux';
import { getProductReviewsExcerpt } from '@shopgate/pwa-common-commerce/reviews/selectors';
import { makeIsBaseProductActive } from '@shopgate/engage/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => {
  const isBaseProductActive = makeIsBaseProductActive();

  return (state, props) => ({
    reviews: getProductReviewsExcerpt(state, props),
    productActive: isBaseProductActive(state, props),
  });
};

export default connect(makeMapStateToProps);
