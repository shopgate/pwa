import { historyRedirect } from '@shopgate/pwa-common/actions/router';
import subscriptions from './index';

jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyRedirect: jest.fn(params => ({
    type: 'HISTORY_REDIRECT',
    params,
  })),
}));
jest.mock('../selectors', () => ({
  hasShopifyCheckout: jest.fn(() => true),
}));
jest.mock('../actions/login', () => jest.fn());
jest.mock('../actions/logout', () => jest.fn());

describe('webcheckout > subscriptions', () => {
  const dispatch = jest.fn();
  let redirectAfterLogin;

  beforeEach(() => {
    jest.clearAllMocks();

    const subscribe = jest.fn();
    subscriptions(subscribe);
    [[, redirectAfterLogin]] = subscribe.mock.calls;
  });

  it('should redirect after a login', () => {
    const redirect = { location: '/checkout' };

    redirectAfterLogin({
      dispatch,
      action: { redirect },
    });

    expect(historyRedirect).toHaveBeenCalledWith(redirect);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'HISTORY_REDIRECT',
      params: redirect,
    });
  });

  it('should keep the current page when the login asks for no redirect', () => {
    redirectAfterLogin({
      dispatch,
      action: { redirect: false },
    });

    expect(historyRedirect).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
