import { historyPush, historyReset } from '../router';
import { INDEX_PATH_DEEPLINK } from '../../constants/RoutePaths';
import handleLink from './handleLink';

jest.mock('../../actions/router', () => ({
  historyPush: jest.fn(),
  historyReset: jest.fn(),
}));

const mockedError = jest.fn();
jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: (...args) => mockedError(...args),
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
      expect(historyReset).toHaveBeenCalledTimes(1);
      expect(mockedError).toHaveBeenCalledTimes(1);
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

  describe('handle relative links', () => {
    it('should not modify valid links', () => {
      const link = '/path/test';
      handleLink({ link })(dispatch);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledWith({ pathname: '/path/test' });
    });

    it('should add a leading slash when not included in link', () => {
      const link = 'path/test';
      handleLink({ link })(dispatch);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledTimes(1);
      expect(historyPush).toHaveBeenCalledWith({ pathname: '/path/test' });
    });
  });
});
