import { connect } from 'react-redux';
import { makeGetSelectedCharacteristic, getProduct } from '@shopgate/engage/product';
import { selectLocation, storeFormInput } from '../../action-creators';
import { makeGetProductLocations, makeGetUserFormInput } from '../../selectors';
import { submitReservation } from '../../actions';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getProductLocations = makeGetProductLocations();
  const getSelectedCharacteristic = makeGetSelectedCharacteristic();
  const getUserFormInput = makeGetUserFormInput();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    locations: getProductLocations(state, props),
    product: getProduct(state, props),
    selectedVariants: getSelectedCharacteristic(state, props),
    userInput: getUserFormInput(state),
  });
}

/**
 * @param {Function} dispatch The dispatch function.
 * @returns {Object}
 */
const mapDispatchToProps = {
  selectLocation,
  submitReservation,
  storeFormInput,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
