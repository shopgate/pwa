import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  addFavorite,
  removeFavorites,
  requestSync,
} from './toggleFavorites';
import { mockedGetState } from '../mock';
import {
  ADD_PRODUCT_TO_FAVORITES,
  REMOVE_PRODUCT_FROM_FAVORITES, REQUEST_FLUSH_FAVORITES_BUFFER,
} from '../constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Favorites - actions', () => {
  describe('Add Favorites', () => {
    it('should add', (done) => {
      const productId = 'product';
      const expectedActions = [{
        type: ADD_PRODUCT_TO_FAVORITES,
        productId,
      }];

      const store = mockStore({});
      store.dispatch(addFavorite(productId));
      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });
  });

  describe('remove favorites', () => {
    it('should remove without relatives', (done) => {
      const productId = 'product';
      const expectedActions = [{
        type: REMOVE_PRODUCT_FROM_FAVORITES,
        productId,
        withRelatives: false,
      }];
      const store = mockStore({});
      store.dispatch(removeFavorites(productId));
      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });

    it('should remove with relatives', (done) => {
      const productId = 'SG118';
      const expectedActions = [{
        type: REMOVE_PRODUCT_FROM_FAVORITES,
        productId,
        withRelatives: true,
      }];
      const store = mockStore(mockedGetState('then', {
        withProducts: true,
      }));
      store.dispatch(removeFavorites(productId, true));
      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 0);
    });

    it('should trigger an instant sync (flush add/remove action buffer)', (done) => {
      const store = mockStore({});
      store.dispatch(requestSync());
      setTimeout(() => {
        expect(store.getActions()).toEqual([{ type: REQUEST_FLUSH_FAVORITES_BUFFER }]);
        done();
      }, 0);
    });
  });
});
