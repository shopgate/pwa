import { connect } from 'react-redux';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { getCartProductDisplayCount } from '@shopgate/pwa-common-commerce/cart/selectors';
import { navigate } from '@shopgate/pwa-common/action-creators/router';
import { ACTION_PUSH } from '@virtuous/conductor/constants';
import { isCartButtonVisible } from '../../selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  activeCartRoute: getCurrentPathname(state) === CART_PATH,
  cartProductCount: getCartProductDisplayCount(state),
  visible: isCartButtonVisible(state),
});

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  openCart: () => dispatch(navigate(ACTION_PUSH, CART_PATH)),
});

export default connect(mapStateToProps, mapDispatchToProps);
