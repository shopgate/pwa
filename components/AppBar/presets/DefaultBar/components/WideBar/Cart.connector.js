import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import {
  getCartProductDisplayCount,
  getGrandTotalData,
  getCurrency,
} from '@shopgate/pwa-common-commerce/cart/selectors';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  count: getCartProductDisplayCount(state),
  currency: getCurrency(state),
  total: getGrandTotalData(state),
});

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: () => dispatch(historyPush({ pathname: CART_PATH })),
});

export default connect(mapStateToProps, mapDispatchToProps);
