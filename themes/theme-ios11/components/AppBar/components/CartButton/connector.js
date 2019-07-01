import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { getCartProductDisplayCount } from '@shopgate/pwa-common-commerce/cart/selectors';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  count: getCartProductDisplayCount(state),
});

const mapDispatchToProps = {
  navigate: () => historyPush({ pathname: CART_PATH }),
};

export default connect(mapStateToProps, mapDispatchToProps);
