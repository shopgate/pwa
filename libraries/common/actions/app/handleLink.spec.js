import { logger } from '@shopgate/pwa-core/helpers';
import { historyPush, historyReset } from '../router';
import { INDEX_PATH_DEEPLINK } from '../../constants/RoutePaths';
import handleLink from './handleLink';

jest.mock('../../actions/router', () => ({
  historyPush: jest.fn(),
  historyReset: jest.fn(),
}));

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('handleLink()', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a redux thunk', () => {
    expect(handleLink()).toBeInstanceOf(Function);
  });

  it('should do nothing when the link is empty', () => {
    handleLink({})(dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  });

  describe('handle deep link', () => {
    it('should dispatch historyReset() when the link is a deeplink to the index page', () => {
      handleLink({ link: `shopgate-10006:/${INDEX_PATH_DEEPLINK}` })(dispatch);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyReset).toHaveBeenCalledTimes(1);
    });

    it('should dispatch historyPush for common deeplinks', () => {
      const link = '/some/page';
      const deeplink = `shopgate-10006:/${link}`;
      handleLink({ link: deeplink })(dispatch);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledWith({ pathname: link });
    });
  });

  describe('handle malicious links', () => {
    it('should remove markup from query parameters of deeplinks', () => {
      handleLink({ link: 'shopgate-10006://search?s=<img src=x onerror=alert(1)>test' })(dispatch);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledWith({ pathname: '/search?s=test' });
    });

    it('should remove markup from query parameters of push message links', () => {
      const link = 'https://example.com/search?s=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3Etest';
      handleLink({ link }, true)(dispatch);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledWith({ pathname: 'https://example.com/search?s=test' });
    });

    it('should not modify regular deeplinks with query parameters', () => {
      handleLink({ link: 'shopgate-10006://search?s=Tom%20%26%20Jerry' })(dispatch);
      expect(historyPush).toHaveBeenCalledWith({ pathname: '/search?s=Tom%20%26%20Jerry' });
    });

    it('should ignore links with a script protocol', () => {
      // eslint-disable-next-line no-script-url
      handleLink({ link: 'javascript:alert(1)' }, true)(dispatch);
      expect(dispatch).not.toHaveBeenCalled();
      expect(historyPush).not.toHaveBeenCalled();
    });
  });

  describe('handle universal link', () => {
    it('should dispatch historyPush for universal link', () => {
      const link = '/page/test';
      const universalLink = `https://example.com${link}`;
      handleLink({ link: universalLink })(dispatch);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledWith({ pathname: link });
    });

    it('should dispatch historyReset() when the link is an universal link to the index page', () => {
      handleLink({ link: 'https://example.com/' })(dispatch);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyReset).toHaveBeenCalledTimes(1);
    });

    it('should dispatch historyReset() when the link is invalid URL', () => {
      handleLink({ link: 'http !@@##%$^&^*&* s://example.com/' })(dispatch);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(logger.error.mock.calls[0][0]).toContain('Could not parse link');
      expect(historyReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('handle external push message links', () => {
    it('should dispatch historyPush for the external link', () => {
      const link = 'http://www.google.de';
      handleLink({ link }, true)(dispatch);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledWith({ pathname: link });
    });

    it('should dispatch historyPush with only the pathname for the external links which are no push messages', () => {
      const link = 'http://www.google.de/path/test';
      handleLink({ link })(dispatch);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledWith({ pathname: '/path/test' });
    });
  });
});
