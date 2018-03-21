import addCurrentProductToCart from '@shopgate/pwa-common-commerce/cart/actions/addCurrentProductToCart';
import {
  isProductPageLoading,
  isProductPageOrderable,
} from '@shopgate/pwa-common-commerce/product/selectors/page';
import { connect } from 'react-redux';
import { selectActionCount } from './selectors';

/**
 * Connects the current application state to the component props.
 * @param {Object} state The current application state.
 * @return {[type]} [description]
 */
const mapStateToProps = state => ({
  isLoading: isProductPageLoading(state),
  isOrderable: isProductPageOrderable(state),
  cartProductCount: selectActionCount(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  handleAddToCart: () => dispatch(addCurrentProductToCart()),
});

export default connect(mapStateToProps, mapDispatchToProps);
