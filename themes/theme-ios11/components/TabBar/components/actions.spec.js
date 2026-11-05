import { historyPush } from '@shopgate/pwa-common/actions/router';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';
import { navigate } from './actions';

jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyPush: jest.fn(params => ({
    type: 'PUSH',
    params,
  })),
}));
jest.mock('@shopgate/pwa-common/selectors/router', () => ({
  getCurrentPathname: jest.fn(),
}));
jest.mock('../helpers/isTabBarVisible', () => jest.fn(() => true));
jest.mock('@shopgate/engage/tracking/selectors/cookieConsent', () => ({
  getIsCookieConsentHandled: jest.fn(),
}));

/**
 * Runs the navigate thunk.
 * @param {Object} params The navigate params.
 * @param {Object} lastRoutes The remembered routes per tab.
 * @returns {Object} The pushed params.
 */
const run = (params, lastRoutes = {}) => {
  const dispatch = jest.fn();
  const state = {
    ui: {
      tabBar: {
        enabled: true,
        visible: true,
        lastRoutes,
      },
    },
  };
  navigate(params)(dispatch, () => state);
  return historyPush.mock.calls[historyPush.mock.calls.length - 1][0];
};

describe('TabBar navigate()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCurrentPathname.mockReturnValue('/cart');
  });

  it('reopens the page a tab showed last', () => {
    expect(run({ pathname: '/browse' }, {
      browse: {
        pathname: '/item/123',
        pattern: '/item/:productId',
        state: { title: 'Jacket' },
      },
    })).toEqual({
      pathname: '/item/123',
      state: {
        title: 'Jacket',
        preventA11yFocus: false,
      },
    });
  });

  it('leads to the start page of a tab without a remembered page', () => {
    expect(run({ pathname: '/browse' })).toEqual({
      pathname: '/browse',
      state: { preventA11yFocus: true },
    });
  });

  it('leads to the start page when the active tab is tapped', () => {
    getCurrentPathname.mockReturnValue('/item/123');

    expect(run({ pathname: '/browse' }, {
      browse: { pathname: '/item/123' },
    }).pathname).toBe('/browse');
  });

  it('leaves links outside of the tabs alone', () => {
    expect(run({ pathname: '/page/imprint' }, {
      browse: { pathname: '/item/123' },
    }).pathname).toBe('/page/imprint');
  });

  it('leaves links into a tab that are not its start page alone', () => {
    expect(run({ pathname: '/category/abc' }, {
      browse: { pathname: '/item/123' },
    }).pathname).toBe('/category/abc');
  });
});
