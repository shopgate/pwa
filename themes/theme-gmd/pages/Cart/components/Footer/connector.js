import { connect } from 'react-redux';
import showTaxDisclaimer from '@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer';
import { hasCouponSupport, getCartItems } from '@shopgate/pwa-common-commerce/cart/selectors';

/**
 * Connects the component with the state.
 * @param {Object} state The application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state) => {
  const hasCartItems = getCartItems(state).length > 0;

  return {
    showCouponsHint: hasCartItems && !hasCouponSupport(state),
    hasCartItems,
  };
};

export default connect(mapStateToProps);
