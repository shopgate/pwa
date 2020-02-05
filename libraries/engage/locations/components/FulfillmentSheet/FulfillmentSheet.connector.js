import { connect } from 'react-redux';
import { selectLocation, storeFormInput } from '@shopgate/pwa-common/action-creators';
import {
  makeGetSelectedCharacteristic,
  getProduct,
} from '@shopgate/engage/product';
import { makeGetUserFormInput } from '@shopgate/engage/user';
import { makeGetProductLocations } from '../../selectors';
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
