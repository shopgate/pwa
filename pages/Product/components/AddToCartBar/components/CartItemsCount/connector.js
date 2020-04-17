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
  return (state, props) => ({
    unit: getProduct(state, props)?.unit,
  });
}

export default connect(makeMapStateToProps);
