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

  test('fetchLocationsById', async () => {
    expect.assertions(1);
    const getLocationsState = jest.fn().mockReturnValue({
      code1: {
        isFetching: false,
        expires: 10,
        location: { code: 'code1' },
      },
    });
    makeGetLocationsState.mockReturnValue(getLocationsState);

    fetchLocations.mockReturnValue(Promise.resolve({
      locations: [{ code: 'code2' }],
    }));

    await fetchLocationsById(['code1', 'code2'])(dispatch, getState);

    expect(fetchLocations).toBeCalledWith({
      codes: ['code2'],
    });
  });
});
