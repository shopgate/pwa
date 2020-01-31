import { SUBMIT_RESERVATION_ERROR } from '../constants';

/**
 * Creates the SUBMIT_RESERVATION_ERROR action object.
 * @param {Array} errors The received error.
 * @return {Object} The SUBMIT_RESERVATION_ERROR action.
 */
function submitReservationError(errors) {
  return {
    type: SUBMIT_RESERVATION_ERROR,
    errors,
  };
}

export default submitReservationError;
