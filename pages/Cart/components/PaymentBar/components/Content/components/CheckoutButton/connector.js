import { connect } from 'react-redux';
import { isViewLoading } from '@shopgate/pwa-common/selectors/view';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { getOrderableStatus } from '@shopgate/pwa-common-commerce/cart/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isActive: getOrderableStatus(state) && !isViewLoading(state, CART_PATH),
});

export default connect(mapStateToProps);
