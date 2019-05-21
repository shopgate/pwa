import { connect } from 'react-redux';
import { getProductEffectivityDates } from '@shopgate/pwa-common-commerce/product';
import productNotAvailable from '@shopgate/pwa-common-commerce/product/action-creators/productNotAvailable';
import { NOT_AVAILABLE_EFFECTIVITY_DATES } from '@shopgate/pwa-common-commerce/product/constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @param {Object} props.productId product.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  dates: getProductEffectivityDates(state, props),
});

/**
 * Maps the contents of the state to the component props.
 * @param {Function} dispatch The dispatch method from the store.
 * @param {Object} props The props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = (dispatch, props) => ({
  productNotAvailable: () => dispatch(productNotAvailable(
    props.productId,
    NOT_AVAILABLE_EFFECTIVITY_DATES
  )),
});

export default connect(mapStateToProps, mapDispatchToProps);
