import '../__mocks__';
import { SUBMIT_RESERVATION_SUCCESS } from '../../constants';
import submitReservationSuccess from '../submitReservationSuccess';

describe('engage > locations > actions-creators', () => {
  test('submitReservationSuccess', () => {
    const result = submitReservationSuccess(['123', '456']);
    expect(result).toEqual({
      type: SUBMIT_RESERVATION_SUCCESS,
      orderNumbers: ['123', '456'],
    });
    expect(result).toMatchSnapshot();
  });
});
