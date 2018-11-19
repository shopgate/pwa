import { connect } from 'react-redux';
import {
  getCurrency,
  getShippingCosts,
} from '@shopgate/pwa-common-commerce/cart/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  currency: getCurrency(state),
  value: getShippingCosts(state),
});

export default connect(mapStateToProps);
