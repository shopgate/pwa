import favorites from './index';

jest.mock('../actions/fetchFavorites', () => withCache => withCache);

let mockedHasFavorites = true;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get hasFavorites() { return mockedHasFavorites; },
}));

describe('Favorites - subscriptions', () => {
  describe('Favorites - enabled', () => {
    it('should register to streams', (done) => {
      const mockedSubscribe = jest.fn();
      const mockedDispatch = jest.fn();
      favorites(mockedSubscribe);
      expect(mockedSubscribe.mock.calls.length).toBe(5);
      mockedSubscribe.mock.calls[0][1]({ dispatch: mockedDispatch });
      mockedSubscribe.mock.calls[1][1]({ dispatch: mockedDispatch });
      mockedSubscribe.mock.calls[2][1]({ dispatch: mockedDispatch });

      expect(mockedDispatch.mock.calls.length).toBe(3);
      expect(mockedDispatch.mock.calls[0][0]).toBe(undefined);
      expect(mockedDispatch.mock.calls[1][0]).toBe(true);
      setTimeout(() => {
        // A favoritesSyncIdle.
        expect(mockedDispatch.mock.calls[2][0]).toBe(true);
        done();
      }, 0);
    });
  });

  describe('Favorites disabled', () => {
    beforeAll(() => {
      mockedHasFavorites = false;
    });

    it('should do nothing and return false', () => {
      const mockedSubscribe = jest.fn();
      favorites(mockedSubscribe);
      expect(mockedSubscribe.mock.calls.length).toBe(0);
    });
  });
});
