import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  SET_VIEW_TITLE,
  REQUEST_PAGE_CONFIG,
} from '@shopgate/engage/core';
import { mockedPipelineRequestFactory } from '@shopgate/engage/core/classes/PipelineRequest/mock';
import {
  pageWillEnter$,
  receivedVisiblePageConfig$,
} from './streams';
import {
  widgetsInitialState,
  widgetsState,
  widgetsPageRoute,
} from './mock';
import subscribe from './subscriptions';

const mockedStore = configureStore([thunk]);

const mockedResolver = jest.fn();

jest.unmock('@shopgate/engage/core');
jest.mock('@shopgate/engage/core/classes/PipelineRequest', () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
  mockedResolver(mockInstance, resolve, reject);
}));

/**
 * Creates the dispatched REQUEST_PAGE_CONFIG action object.
 * @param {Object} pageId The page to get the widgets for.
 * @returns {Object} The dispatched action object.
 */
const results = [
  {
    type: REQUEST_PAGE_CONFIG,
    pageId: widgetsPageRoute.params.pageId,
  },
  {
    type: SET_VIEW_TITLE,
    title: widgetsState.page.cms_test.title,
  },
];

describe.skip('Page subscriptions', () => {
  let subscribeMock;
  let first;
  let second;
  let store = mockedStore();

  beforeAll(() => {
    jest.resetAllMocks();
    store.clearActions();
    subscribeMock = jest.fn();
  });

  it('should subscribe', () => {
    subscribe(subscribeMock);
    expect(subscribeMock.mock.calls.length).toBe(2);
    [first, second] = subscribeMock.mock.calls;
    expect(first[0]).toBe(pageWillEnter$);
    expect(second[0]).toBe(receivedVisiblePageConfig$);
  });

  describe('pageWillEnter$', () => {
    it('should fetch page config', () => {
      const action = {
        route: widgetsPageRoute,
      };
      const mockedState = {
        ...widgetsInitialState,
      };

      store = mockedStore(mockedState);
      first[1]({
        action,
        dispatch: store.dispatch,
      });
      const actions = store.getActions();
      expect(actions[0]).toEqual(results[0]);
    });

    it('should fetch page config', () => {
      const action = {
        config: widgetsState.page.cms_test,
      };
      const mockedState = {
        ...widgetsState,
      };

      store = mockedStore(mockedState);
      second[1]({
        action,
        dispatch: store.dispatch,
      });

      const actions = store.getActions();
      expect(actions[0]).toEqual(results[1]);
    });
  });
});
