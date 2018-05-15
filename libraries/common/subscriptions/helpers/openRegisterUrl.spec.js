import openRegisterUrl from './openRegisterUrl';
import ParsedLink from '../../components/Router/helpers/parsed-link';

let mockRedirect;

jest.mock('../../components/Router/helpers/parsed-link');
jest.mock('../../selectors/history', () => ({
  getRedirectLocation: jest.fn().mockImplementation(() => {
    return mockRedirect;
  }),
}));

describe('subscriptions/helpers/openRegisterUrl', () => {
  beforeEach(() => {
    mockRedirect = {
      pathname: '/',
      params: {},
    };
  });

  it('should add callback data', () => {
    openRegisterUrl('http://www.shopgate.com/register', {});
    expect(ParsedLink).toHaveBeenLastCalledWith('http://www.shopgate.com/register?sgcloud_callback_data=%7B%22redirectTo%22%3A%22%2F%22%7D');
  });

  it('should add callback data with a redirect to checkout', () => {
    mockRedirect = {
      pathname: '/checkout',
      params: {},
    };

    openRegisterUrl('http://www.shopgate.com/register', {});
    expect(ParsedLink).toHaveBeenLastCalledWith('http://www.shopgate.com/register?sgcloud_callback_data=%7B%22redirectTo%22%3A%22%2F%22%7D&sgcloud_checkout=1');
  });

  it('should redirect to the path provided', () => {
    mockRedirect = {
      pathname: '/cart',
      params: {},
    };

    openRegisterUrl('http://www.shopgate.com/register', {});
    expect(ParsedLink).toHaveBeenLastCalledWith('http://www.shopgate.com/register?sgcloud_callback_data=%7B%22redirectTo%22%3A%22%2Fcart%22%7D');
  });

  it('should add parameters from redirect', () => {
    mockRedirect = {
      pathname: '/',
      params: {
        first: 'first',
        second: 'second',
      },
    };

    openRegisterUrl('http://www.shopgate.com/register', {});
    expect(ParsedLink).toHaveBeenLastCalledWith('http://www.shopgate.com/register?sgcloud_callback_data=%7B%22redirectTo%22%3A%22%2F%3Ffirst%3Dfirst%26second%3Dsecond%22%7D');
  });

  it('shoud keep the parameters from original url', () => {
    openRegisterUrl('http://www.shopgate.com/register?action=try', {});
    expect(ParsedLink).toHaveBeenLastCalledWith('http://www.shopgate.com/register?sgcloud_callback_data=%7B%22redirectTo%22%3A%22%2F%22%7D&action=try');
    openRegisterUrl('http://www.shopgate.com/register?action=try&have=another', {});
    expect(ParsedLink).toHaveBeenLastCalledWith('http://www.shopgate.com/register?sgcloud_callback_data=%7B%22redirectTo%22%3A%22%2F%22%7D&action=try&have=another');
  });
});
