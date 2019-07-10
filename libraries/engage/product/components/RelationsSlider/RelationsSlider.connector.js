import { connect } from 'react-redux';
import { fetchProductRelations, makeGetMaximumRelatedProducts } from '@shopgate/engage/product';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getMaximumRelatedProducts = makeGetMaximumRelatedProducts();

  /**
  * @param {Object} state The application state.
  * @param {Object} props The component props.
  * @returns {Object}
  */
  return (state, props) => ({
    products: getMaximumRelatedProducts(state, props),
  });
}

/**
 * @param {Function} dispatch Dispatches an action.
 * @param {Object} props The component props.
 * @returns {Object}
 */
const mapDispatchToProps = (dispatch, { productId, type, limit = 100 }) => ({
  getRelations: () => dispatch(fetchProductRelations({
    productId,
    type,
    limit,
  })),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
