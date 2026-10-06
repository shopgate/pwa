import { historyPush, historyReplace } from '@shopgate/pwa-common/actions/router';
import { submitSearch } from './actions';

jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyPush: jest.fn(params => ({
    type: 'PUSH',
    params,
  })),
  historyReplace: jest.fn(params => ({
    type: 'REPLACE',
    params,
  })),
}));
jest.mock('@shopgate/pwa-common/streams/router', () => ({
  routeDidEnter$: { subscribe: jest.fn() },
}));
jest.mock('@shopgate/engage/product/components/FilterBar/components/Content/actions/openFilterRoute', () => jest.fn());

const run = (pattern, phrase) => {
  const dispatch = jest.fn(action => action);
  const getState = () => ({
    router: {
      currentRoute: { pattern },
    },
  });
  return submitSearch(phrase)(dispatch, getState);
};

jest.mock('@shopgate/pwa-common/selectors/router', () => ({
  getCurrentRoute: state => state.router.currentRoute,
}));

describe('Search actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens new results from other pages', () => {
    run('/browse', 'red shoes');

    expect(historyPush).toHaveBeenCalledWith({ pathname: '/search?s=red%20shoes' });
    expect(historyReplace).not.toHaveBeenCalled();
  });

  it('replaces the results when a search starts on the results page', () => {
    run('/search', 'Jacke & Mütze');

    expect(historyReplace).toHaveBeenCalledWith({ pathname: '/search?s=Jacke%20%26%20M%C3%BCtze' });
    expect(historyPush).not.toHaveBeenCalled();
  });
});
