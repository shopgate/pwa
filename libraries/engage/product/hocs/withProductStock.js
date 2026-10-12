import { connect } from 'react-redux';
// Imported from the selector file instead of '@shopgate/engage/product': the index of the product
// module loads components that use this HOC, so it was undefined when this folder was loaded first.
import { getProduct } from '../selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => {
  const product = getProduct(state, props);

  return {
    stock: product ? product.stock : null,
  };
};

export default connect(mapStateToProps);
