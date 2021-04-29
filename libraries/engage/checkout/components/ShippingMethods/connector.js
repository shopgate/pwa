import { connect } from 'react-redux';
import {
  getHasDirectShipItems,
} from '@shopgate/engage/checkout/selectors/order';
/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props
   * @returns {Object}
   */
  return state => ({
    orderHasDirectShipItems: getHasDirectShipItems(state),
  });
}

export default connect(makeMapStateToProps);
