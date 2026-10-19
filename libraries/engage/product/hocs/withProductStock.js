import { connect } from 'react-redux';
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
