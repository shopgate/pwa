import { connect } from 'react-redux';
import { getProduct } from '@shopgate/engage/product';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    product: getProduct(state, props),
  });
}

export default connect(
  makeMapStateToProps
);
