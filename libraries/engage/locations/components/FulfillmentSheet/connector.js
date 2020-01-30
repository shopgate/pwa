import { connect } from 'react-redux';
import { selectLocation } from '@shopgate/pwa-common/action-creators';
import {
  makeGetSelectedCharacteristic,
  makeGetProductLocations,
  getProduct,
} from '@shopgate/engage/product';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getProductLocations = makeGetProductLocations();
  const getSelectedCharacteristic = makeGetSelectedCharacteristic();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    locations: getProductLocations(state, props),
    product: getProduct(state, props),
    selectedVariants: getSelectedCharacteristic(state, props),
  });
}

/**
 * @param {Function} dispatch The dispatch function.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  selectLocation: location => dispatch(selectLocation(location)),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
