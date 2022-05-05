import { connect } from 'react-redux';
import addToCart from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
import { isBaseProduct, isProductOrderable, hasProductVariety } from '@shopgate/pwa-common-commerce/product/selectors/product';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { MODAL_VARIANT_SELECT } from '@shopgate/pwa-ui-shared/Dialog/constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props Props
 * @param {string} props.productId Id of the product
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  isBaseProduct: isBaseProduct(state, props),
  hasVariety: hasProductVariety(state, props),
  isOrderable: isProductOrderable(state, props),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addToCart: productData => dispatch(addToCart([productData])),
  showVariantModal: productId => dispatch(showModal({
    title: null,
    type: MODAL_VARIANT_SELECT,
    message: 'favorites.modal.message',
    confirm: 'favorites.modal.confirm',
    dismiss: 'common.cancel',
    params: {
      productId,
    },
  })),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.isBaseProduct !== next.isBaseProduct) {
    return false;
  }

  if (prev.isOrderable !== next.isOrderable) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
