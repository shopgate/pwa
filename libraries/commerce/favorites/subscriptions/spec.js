import { fetchProductsById } from '@shopgate/pwa-common-commerce/product';
import favorites from './index';

jest.mock('../actions/fetchFavorites', () => withCache => withCache);

let mockedHasFavorites = true;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get hasFavorites() { return mockedHasFavorites; },
}));

jest.mock('@shopgate/pwa-common-commerce/product', () => ({
  fetchProductsById: jest.fn(),
}));

describe('Favorites - subscriptions', () => {
  describe('Favorites - enabled', () => {
    const mockedSubscribe = jest.fn();
    const mockedGetState = jest.fn().mockReturnValue({
      favorites: {
        products: {
          ids: ['prod1'],
        },
      },
    });
    const mockedDispatch = jest.fn().mockResolvedValue();

    favorites(mockedSubscribe);

    it('should register to streams', (done) => {
      expect(mockedSubscribe.mock.calls.length).toBe(5);
      mockedSubscribe.mock.calls[0][1]({ dispatch: mockedDispatch });

      // eslint-disable-next-line extra-rules/no-single-line-objects
      mockedSubscribe.mock.calls[1][1]({ dispatch: mockedDispatch, getState: mockedGetState });
      mockedSubscribe.mock.calls[2][1]({ dispatch: mockedDispatch });

      expect(mockedDispatch.mock.calls.length).toBe(3);
      expect(mockedDispatch.mock.calls[0][0]).toBe(undefined);
      expect(mockedDispatch.mock.calls[2][0]).toBe(true);

      setTimeout(() => {
        expect(fetchProductsById).toBeCalledWith(['prod1'], null, false);
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
