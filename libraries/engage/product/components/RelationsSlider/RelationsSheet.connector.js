import { connect } from 'react-redux';
import { makeGetMaximumRelatedProducts } from '@shopgate/engage/product';

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

export default connect(makeMapStateToProps);
