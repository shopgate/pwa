import { connect } from 'react-redux';
import { getMaximumRelatedProducts } from '@shopgate/pwa-common-commerce/product';

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
  })(state),
});

export default connect(mapStateToProps);
