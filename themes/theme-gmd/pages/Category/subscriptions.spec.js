import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { REQUEST_CATEGORY } from '@shopgate/engage/category';
import { mockedPipelineRequestFactory } from '@shopgate/engage/core/classes/PipelineRequest/mock';
import {
  routerState,
  childCategoryRouteMock,
  uiState,
  categoryState,
  initialCategoryState,
} from '@shopgate/pwa-common-commerce/category/mock';
import { categoryError$ } from '@shopgate/pwa-common-commerce/category/streams';
import { receivedVisibleCategory$ } from './streams';
import subscribe from './subscriptions';

const mockedStore = configureStore([thunk]);
const mockedResolver = jest.fn();
jest.mock('@shopgate/engage/core/classes/PipelineRequest', () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
  mockedResolver(mockInstance, resolve, reject);
}));

describe.skip('Category subscriptions', () => {
  let subscribeMock;
  let categoryWillEnter;
  let receive;
  let categoryErr;
  let store = mockedStore();
  beforeAll(() => {
    jest.resetAllMocks();
    store.clearActions();
    subscribeMock = jest.fn();
  });
  it('should subscribe', () => {
    subscribe(subscribeMock);
    expect(subscribeMock.mock.calls.length).toBe(5);

    [categoryWillEnter, , receive, categoryErr] = subscribeMock.mock.calls;
    expect(receive[0]).toBe(receivedVisibleCategory$);
    expect(categoryErr[0]).toBe(categoryError$);
  });

  describe.skip('categoryWillEnter$', () => {
    it('should fetch category when page is entered', () => {
      const action = {
        route: childCategoryRouteMock,
      };
      const mockedState = {
        ...routerState,
        ...initialCategoryState,
        ...uiState,
      };

      store = mockedStore(mockedState);
      categoryWillEnter[1]({
        action,
        dispatch: store.dispatch,
      });

      const actions = store.getActions();
      expect(actions[0].type).toBe(REQUEST_CATEGORY);
      expect(actions[0].categoryId).toBe(categoryState.category.categoriesById.women.id);
    });

    it('should not fetch category again when page is entered', () => {
      const action = {
        route: childCategoryRouteMock,
      };
      const mockedState = {
        ...routerState,
        category: {
          ...categoryState.category,
          currentCategoryId: 'women',
        },
        ...uiState,
      };

      store = mockedStore(mockedState);
      categoryWillEnter[1]({
        action,
        dispatch: store.dispatch,
      });

      const actions = store.getActions();
      expect(actions[0].title).toBe(categoryState.category.categoriesById.women.name);
    });
  });

  describe('receivedVisibleCategory$', () => {
    it('should not fetch category again when page is entered', () => {
      const action = {
        categoryData: categoryState.category.categoriesById.women,
      };
      const mockedState = {
        ...routerState,
        category: {
          ...categoryState.category,
          currentCategoryId: 'women',
        },
        ...uiState,
      };

      store = mockedStore(mockedState);
      receive[1]({
        action,
        dispatch: store.dispatch,
      });

      const actions = store.getActions();
      expect(actions[0].title).toBe(categoryState.category.categoriesById.women.name);
    });
  });
});
