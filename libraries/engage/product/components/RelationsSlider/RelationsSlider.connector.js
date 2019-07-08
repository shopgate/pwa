import { connect } from 'react-redux';
import { fetchProductRelations, getMaximumRelatedProducts } from '@shopgate/pwa-common-commerce/product';

/**
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object}
 */
const mapStateToProps = (state, { productId, type, limit = 100 }) => ({
  products: getMaximumRelatedProducts({
    productId,
    type,
    limit,
    max: 10,
  })(state),
});

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

export default connect(mapStateToProps, mapDispatchToProps);
