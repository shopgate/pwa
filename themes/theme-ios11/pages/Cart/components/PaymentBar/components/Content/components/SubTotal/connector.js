import { connect } from 'react-redux';
import { getSubTotal } from '@shopgate/engage/cart';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  amount: getSubTotal(state),
});

export default connect(mapStateToProps);
