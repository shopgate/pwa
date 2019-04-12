import { connect } from 'react-redux';
import { getProductPriceData } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @param {Object} props.productId product.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  price: getProductPriceData(state, props),
});

export default connect(mapStateToProps);
