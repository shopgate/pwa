import '../__mocks__';
import requestLocations from '../requestLocations';

describe('engage > locations > actions-creators', () => {
  test('requestLocations', () => {
    expect(requestLocations({ codes: ['code1'] })).toMatchSnapshot();
  });
});
