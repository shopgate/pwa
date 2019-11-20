import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import { FETCH_CHECKOUT_URL_TIMEOUT } from '../constants';
import fetchCheckoutUrl from './fetchCheckoutUrl';

let mockedResolver;
jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
    mockedResolver(mockInstance, resolve, reject);
  })
);

const mockedErrorLog = jest.fn();
jest.mock('@shopgate/pwa-core/helpers/index', () => ({
  logger: {
    error: (...args) => mockedErrorLog(...args),
  },
}));

describe('fetchCheckoutUrl', () => {
  beforeEach(() => {
    mockedErrorLog.mockClear();
  });

  it('should call the pipeline and resolve', async () => {
    const dispatch = jest.fn();
    mockedResolver = ((mockInstance, resolve) => {
      expect(mockInstance.timeout).toBe(FETCH_CHECKOUT_URL_TIMEOUT);
      expect(mockInstance.retries).toBe(0);
      resolve({
        url: 'https://example.com',
        expires: 0,
      });
    });
    const result = await fetchCheckoutUrl()(dispatch);
    expect(result.url).toBe('https://example.com');
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0][0].urlType).toBe('checkout');
    expect(dispatch.mock.calls[1][0].url).toBe('https://example.com');
    expect(dispatch.mock.calls[1][0].expires).toBe(0);
  });

  it('should call the pipeline and reject', async () => {
    const dispatch = jest.fn();
    const error = new Error('Test');
    mockedResolver = (mockInstance, resolve, reject) => {
      reject(error);
    };

    try {
      await fetchCheckoutUrl()(dispatch);
    } catch (err) {
      expect(err).toBe(error);
    }
  });
});
