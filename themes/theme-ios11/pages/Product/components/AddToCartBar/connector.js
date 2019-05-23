import { connect } from 'react-redux';
import { isProductOrderable, hasProductVariants } from '@shopgate/engage/product';
import { isProductPageLoading } from '@shopgate/engage/product';
import { addProductToCart } from './actions';

/**
 * Connects the current application state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  disabled: !isProductOrderable(state, props) && !hasProductVariants(state, props),
  loading: isProductPageLoading(state, props),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addToCart: data => dispatch(addProductToCart(data)),
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
