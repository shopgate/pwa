import { connect } from 'react-redux';
import { showTaxDisclaimer } from '@shopgate/engage/market';
import { hasCouponSupport, getCartItems } from '@shopgate/engage/cart';

/**
 * Connects the component with the state.
 * @param {Object} state The application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state) => {
  const hasCartItems = getCartItems(state).length > 0;

  return {
    showCouponsHint: hasCartItems && !hasCouponSupport(state),
    showTaxDisclaimer: hasCartItems && showTaxDisclaimer,
  };
};

export default connect(mapStateToProps);
