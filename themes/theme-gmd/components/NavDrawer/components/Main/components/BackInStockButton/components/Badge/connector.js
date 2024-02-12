import { connect } from 'react-redux';
import { getHasBackInStockSubscriptions } from '@shopgate/engage/back-in-stock';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  visible: getHasBackInStockSubscriptions(state),
});

export default connect(mapStateToProps);
