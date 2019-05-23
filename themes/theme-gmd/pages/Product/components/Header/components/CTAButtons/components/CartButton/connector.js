import { connect } from 'react-redux';
import {
  hasProductVariants,
  isProductOrderable,
  isProductPageLoading,
} from '@shopgate/engage/product';
import { addProductToCart } from './actions';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  /**
   * 1. Product has no variants and not orderable
   * 2. Parent product can be not orderable but having orderable variants
   */
  disabled: !isProductOrderable(state, props) && !hasProductVariants(state, props),
  loading: isProductPageLoading(state, props),
});

/**
 * @param {Function} dispatch The redux dispatch function.
 * @param {Function} props The component props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addToCart: (product) => {
    dispatch(addProductToCart(product));
  },
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.disabled !== next.disabled) {
    return false;
  }

  if (prev.loading !== next.loading) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
