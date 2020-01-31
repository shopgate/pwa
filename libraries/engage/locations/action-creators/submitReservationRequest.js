import { SUBMIT_RESERVATION_REQUEST } from '../constants';

/**
 * Creates the SUBMIT_RESERVATION_REQUEST action object.
 * @param {Object} order The reservation order.
 * @return {Object} The SUBMIT_RESERVATION_REQUEST action.
 */
function submitReservationRequest(order) {
  return {
    type: SUBMIT_RESERVATION_REQUEST,
    order,
  };
}

export default submitReservationRequest;
