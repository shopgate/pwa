import { connect } from 'react-redux';
import { fetchProductRelations, getRelatedProducts } from '@shopgate/pwa-common-commerce/product';

/**
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object}
 */
const mapStateToProps = (state, { productId, type }) => ({
  products: getRelatedProducts({
    productId,
    type,
    limit: 100,
  })(state),
});

/**
 * @param {Function} dispatch Dispatches an action.
 * @param {Object} props The component props.
 * @returns {Object}
 */
const mapDispatchToProps = (dispatch, { productId, type }) => ({
  getRelations: () => dispatch(fetchProductRelations({
    productId,
    type,
    limit: 100,
  })),
});

export default connect(mapStateToProps, mapDispatchToProps);
