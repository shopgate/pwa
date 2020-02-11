import { makeGetLocationsState } from '../../selectors';
import fetchLocations from '../fetchLocations';
import fetchLocationsById from '../fetchLocationsById';

jest.mock('../fetchLocations', () => jest.fn());
jest.mock('../../selectors', () => ({
  makeGetLocationsState: jest.fn(),
}));

describe('engage > locations > actions > fetchLocationsById', () => {
  const dispatch = jest.fn(arg => arg);
  const getState = jest.fn();

  test('fetchLocationsById', () => {
    expect.assertions(2);
    const getLocationsState = jest.fn().mockReturnValue({
      code1: { code: 'code1' },
    });
    makeGetLocationsState.mockReturnValue(getLocationsState);

    fetchLocations.mockReturnValue(Promise.resolve({
      locations: [{ code: 'code2' }],
    }));

    const result = fetchLocationsById(['code1', 'code2'])(dispatch, getState);

    expect(fetchLocations).toBeCalledWith({
      codes: ['code2'],
    });
    expect(result).resolves.toEqual([
      { code: 'code1' },
      { code: 'code2' },
    ]);
  });
});
