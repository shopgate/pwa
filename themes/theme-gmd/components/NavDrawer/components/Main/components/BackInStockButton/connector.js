import { connect } from 'react-redux';
import { getIsBackInStockEnabled } from '@shopgate/engage/back-in-stock/selectors';

/**
 * @param {Object} state The application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  isBackInStockEnabled: getIsBackInStockEnabled(state),
});

export default connect(mapStateToProps);
