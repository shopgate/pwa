import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import fetchFavorites from './fetchFavorites';
import {
  mockedList,
  mockedGetState,
} from '../mock';
import {
  RECEIVE_FAVORITES,
  REQUEST_FAVORITES,
  ERROR_FETCH_FAVORITES,
} from '../constants';
import { SHOPGATE_USER_GET_FAVORITES } from '../constants/Pipelines';

let mockedResolver;
jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => (
    mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
      mockedResolver(mockInstance, resolve, reject);
    })
  )
);

// Prevent console output on pipeline error test scenario
jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('fetchFavorites()', () => {
  it('should call appropriate actions on *resolved* pipeline request', async (done) => {
    mockedResolver = (mockInstance, resolve) => {
      resolve({
        ...mockedList,
        mockInstance,
      });
    };

    const mockedDispatch = jest.fn();

    try {
      const result = await fetchFavorites()(mockedDispatch, mockedGetState('then'));

      expect(result.mockInstance.name).toBe(SHOPGATE_USER_GET_FAVORITES);
      expect(mockedDispatch).toHaveBeenCalledTimes(2);
      expect(mockedDispatch.mock.calls[0][0].type).toBe(REQUEST_FAVORITES);
      expect(mockedDispatch.mock.calls[1][0].type).toBe(RECEIVE_FAVORITES);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should call appropriate action on *rejected* pipeline request', async (done) => {
    mockedResolver = (mockInstance, resolve, reject) => {
      reject({
        ...mockedList,
        mockInstance,
      });
    };

    const mockedDispatch = jest.fn();

    try {
      const result = await fetchFavorites()(mockedDispatch, mockedGetState('then'));

      expect(result.mockInstance.name).toBe(SHOPGATE_USER_GET_FAVORITES);
      expect(mockedDispatch).toHaveBeenCalledTimes(2);
      expect(mockedDispatch.mock.calls[0][0].type).toBe(REQUEST_FAVORITES);
      expect(mockedDispatch.mock.calls[1][0].type).toBe(ERROR_FETCH_FAVORITES);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should not call pipeline when data is cached and valid', (done) => {
    const mockedDispatch = jest.fn();
    const promise = fetchFavorites()(mockedDispatch, mockedGetState('then', { validCache: true }));
    promise.then((result) => {
      expect(result).toBe(null);
      expect(mockedDispatch.mock.calls.length).toBe(0);
      done();
    });
  });
});
