import { connect } from 'react-redux';
import { getBaseProductId, getProductRating } from '@shopgate/engage/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  productId: getBaseProductId(state, props),
  rating: getProductRating(state, props),
});

export default connect(mapStateToProps);
