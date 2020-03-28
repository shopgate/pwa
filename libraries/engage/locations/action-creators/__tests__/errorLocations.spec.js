import '../__mocks__';
import errorLocations from '../errorLocations';

describe('engage > locations > actions-creators', () => {
  test('errorLocations', () => {
    const result = errorLocations({ codes: ['code1', 'code2'] }, new Error('Error'));
    expect(result).toMatchSnapshot();
  });
});
