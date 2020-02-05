import { SUBMIT_RESERVATION_ERROR } from '../../constants';
import submitReservationError from '../submitReservationError';

describe('engage > locations > actions-creators', () => {
  test('submitReservationError', () => {
    const result = submitReservationError(['error1', 'error2']);
    expect(result).toEqual({
      type: SUBMIT_RESERVATION_ERROR,
      errors: ['error1', 'error2'],
    });
    expect(result).toMatchSnapshot();
  });
});
