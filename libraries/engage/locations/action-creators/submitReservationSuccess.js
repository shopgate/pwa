import { SUBMIT_RESERVATION_SUCCESS } from '../constants';

/**
 * Creates the SUBMIT_RESERVATION_SUCCESS action object.
 * @param {Array} orderNumbers The returned order numbers.
 * @return {Object} The SUBMIT_RESERVATION_SUCCESS action.
 */
function submitReservationSuccess(orderNumbers) {
  return {
    type: SUBMIT_RESERVATION_SUCCESS,
    orderNumbers,
  };
}

export default submitReservationSuccess;
