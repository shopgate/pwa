import { connect } from 'react-redux';
import { getCheckoutTaxLines } from '../../selectors/order';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  return state => ({
    taxLines: getCheckoutTaxLines(state),
  });
}

export default connect(makeMapStateToProps);
