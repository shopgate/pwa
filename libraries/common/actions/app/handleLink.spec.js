import { historyPush, historyReset } from '../../actions/router';
import { INDEX_PATH_DEEPLINK } from '../../constants/RoutePaths';
import handleLink from './handleLink';

jest.mock('../../actions/router', () => ({
  historyPush: jest.fn(),
  historyReset: jest.fn(),
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

  it('should dispatch historyPush for universal link', () => {
    const link = '/page/test';
    const universalLink = 'https://example.com/page/test';
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
});
