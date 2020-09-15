import { connect } from 'react-redux';
import {
  getCartProductDisplayCount,
  getGrandTotalData,
  getCurrency,
} from '@shopgate/pwa-common-commerce/cart/selectors';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { getDefaultCurrency } from '@shopgate/engage/core';
import { navigate } from './WideBar.actions';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state) => {
  const currency = getCurrency(state) || getDefaultCurrency(state);

  return ({
    count: getCartProductDisplayCount(state),
    total: getGrandTotalData(state),
    currency,
  });
};

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: () => dispatch(navigate(CART_PATH)),
});

export default connect(mapStateToProps, mapDispatchToProps);
