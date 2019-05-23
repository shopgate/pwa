import { connect } from 'react-redux';
import {
  makeGetProductEffectivityDates,
  productNotAvailable,
  NOT_AVAILABLE_EFFECTIVITY_DATES,
} from '@shopgate/engage/product';

/**
 * Create exclusive component selector.
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getProductEffectivityDates = makeGetProductEffectivityDates();

  return (state, props) => ({
    dates: getProductEffectivityDates(state, props),
  });
}

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

export default connect(makeMapStateToProps, mapDispatchToProps);
