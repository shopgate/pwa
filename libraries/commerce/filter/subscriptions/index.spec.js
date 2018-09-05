import * as streams from '../streams';
import filters from './index';

const mockedSetActiveFilters = jest.fn();
jest.mock(
  '../action-creators/setActiveFilters',
  () => (...args) => () => mockedSetActiveFilters(...args)
);

const mockedGetFilters = jest.fn();
jest.mock('../actions/getFilters', () => (...args) => () => mockedGetFilters(...args));

jest.mock('@shopgate/pwa-common/selectors/history', () => ({
  getSearchPhrase: () => 'searchPhraseTest',
  getHistoryPathname: () => '/search',
}));

describe.skip('Filters subscriptions', () => {
  const subscribe = jest.fn();
  const subscriptions = {};

  beforeEach(() => {
    mockedSetActiveFilters.mockReset();
    mockedGetFilters.mockReset();
  });

  it('should subscribe to streams', () => {
    filters(subscribe);
    const streamNames = Object.keys(streams);
    subscribe.mock.calls.forEach((call) => {
      const [stream, cb] = call;
      streamNames.some((name) => {
        if (stream === streams[name]) {
          subscriptions[name] = {
            cb,
          };
          return true;
        }
        return false;
      });
    });
    expect(Object.keys(subscriptions).length).toBe(Object.keys(streams).length);
  });

  // TODO: searchRouteWasUpdated$ is not there anymore. Test the substitute instead here
  it('searchRouteWasUpdated$', () => {
    const dispatch = jest.fn();
    subscriptions.searchRouteWasUpdated$.cb({
      dispatch,
      getState: () => {},
    });
    dispatch.mock.calls[0][0]();
    dispatch.mock.calls[1][0]();

    expect(mockedSetActiveFilters).toHaveBeenCalledTimes(1);
    expect(mockedGetFilters).toHaveBeenCalledTimes(1);
  });
});

