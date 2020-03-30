import '../__mocks__';
import receiveLocations from '../receiveLocations';

describe('engage > locations > actions-creators', () => {
  test('receiveLocations', () => {
    expect(receiveLocations([{
      code: 'code1',
      name: 'Location name',
    }])).toMatchSnapshot();
  });
});
