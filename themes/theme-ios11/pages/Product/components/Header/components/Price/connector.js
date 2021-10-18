import { connect } from 'react-redux';
import { getProductPriceData, hasProductVariants } from '@shopgate/pwa-common-commerce/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  price: getProductPriceData(state, props),
  hasProductVariants: hasProductVariants(state, props),
});

export default connect(mapStateToProps);
