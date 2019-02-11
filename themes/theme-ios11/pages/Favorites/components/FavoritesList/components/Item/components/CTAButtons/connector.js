import { connect } from 'react-redux';
import addToCart from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
import { hasProductVariants, isBaseProduct, isOrderable } from '@shopgate/pwa-common-commerce/product/selectors/product';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { MODAL_VARIANT_SELECT } from '@shopgate/pwa-ui-shared/Dialog/constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current props.
 * @param {string} props.productId The current product id.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, { productId }) => ({
  isBaseProduct: isBaseProduct(state, productId),
  isOrderable: isOrderable(state, productId),
  hasVariants: hasProductVariants(state, productId),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addToCart: productData => dispatch(addToCart(productData)),
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

export default connect(mapStateToProps, mapDispatchToProps);
