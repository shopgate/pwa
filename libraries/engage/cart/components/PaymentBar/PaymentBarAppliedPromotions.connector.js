import { connect } from 'react-redux';
import { getAppliedPromotionsWithoutCoupons } from '../../cart.selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  promotions: getAppliedPromotionsWithoutCoupons(state),
});

export default connect(mapStateToProps);
