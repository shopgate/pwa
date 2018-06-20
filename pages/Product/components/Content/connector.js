import { connect } from 'react-redux';
import {
  getBaseProductId,
  getVariantId,
  isBaseProduct,
} from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  isBaseProduct: isBaseProduct(state, props),
  baseProductId: getBaseProductId(state, props),
  variantId: getVariantId(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.isBaseProduct && next.isBaseProduct) {
    return false;
  }

  if (!prev.isBaseProduct && next.isBaseProduct) {
    return false;
  }

  if (!prev.variantId && next.variantId) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
