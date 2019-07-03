import { connect } from 'react-redux';
import { fetchProductRelations, getRelatedProducts } from '@shopgate/pwa-common-commerce/product';

/**
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object}
 */
const mapStateToProps = (state, { productId, type, limit = 10 }) => ({
  products: getRelatedProducts({
    productId,
    type,
    limit,
  })(state),
});

/**
 * @param {Function} dispatch Dispatches an action.
 * @param {Object} props The component props.
 * @returns {Object}
 */
const mapDispatchToProps = (dispatch, { productId, type, limit = 10 }) => ({
  getRelations: () => dispatch(fetchProductRelations({
    productId,
    type,
    limit,
  })),
});

export default connect(mapStateToProps, mapDispatchToProps);
