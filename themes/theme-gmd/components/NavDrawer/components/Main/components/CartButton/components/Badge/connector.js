import { connect } from 'react-redux';
import { getCartProductCount } from '@shopgate/engage/cart';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  count: getCartProductCount(state),
});

export default connect(mapStateToProps);
