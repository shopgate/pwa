import { connect } from 'react-redux';
import { getProduct } from '@shopgate/engage/product';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  /**
   * @param {Object} state The current application state.
   * @param {Object} props The component props.
   * @return {Object} The extended component props.
   */
  return (state, props) => {
    const product = getProduct(state, props);

    return {
      unit: product?.unit,
      hasCatchWeight: product?.hasCatchWeight,
    };
  };
}

export default connect(makeMapStateToProps);
