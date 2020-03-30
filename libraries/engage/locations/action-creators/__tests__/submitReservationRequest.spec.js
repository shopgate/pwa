import '../__mocks__';
import { SUBMIT_RESERVATION_REQUEST } from '../../constants';
import submitReservationRequest from '../submitReservationRequest';

describe('engage > locations > actions-creators', () => {
  test('submitReservationRequest', () => {
    const result = submitReservationRequest({ code: 'product123' });
    expect(result).toEqual({
      type: SUBMIT_RESERVATION_REQUEST,
      order: { code: 'product123' },
    });
    expect(result).toMatchSnapshot();
  });
});
