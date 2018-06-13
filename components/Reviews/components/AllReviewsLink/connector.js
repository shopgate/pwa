import { connect } from 'react-redux';
import { getCurrentBaseProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { getProductReviewCount } from '@shopgate/pwa-common-commerce/reviews/selectors';
/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  productId: getCurrentBaseProductId(state, props),
  totalReviewCount: getProductReviewCount(state, props),
});

export default connect(mapStateToProps);
