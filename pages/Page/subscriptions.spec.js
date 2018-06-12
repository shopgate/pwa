import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { SET_VIEW_TITLE } from '@shopgate/pwa-common/constants/ActionTypes';
import { REQUEST_ROOT_CATEGORIES } from '@shopgate/pwa-common-commerce/category/constants';
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import { widgetsInitialState } from './mock';
import subscribe from './subscriptions';

const mockedStore = configureStore([thunk]);

const mockedResolver = jest.fn();
jest.mock('@shopgate/pwa-core/classes/PipelineRequest', () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
  mockedResolver(mockInstance, resolve, reject);
}));

describe('RootCategory subscriptions', () => {
  let subscribeMock;
  let first;
  let store = mockedStore();

  it('should subscribe', () => {
    subscribe(subscribeMock);
    expect(subscribeMock.mock.calls.length).toBe(1);
    [first] = subscribeMock.mock.calls;
    expect(first[0]).toBe(routeWillEnter$);
  });

  describe('pageWillEnter$', () => {
    it('should fetch page config', () => {
      const action = {
        route: null,
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
      expect(actions[0].type).toBe(REQUEST_ROOT_CATEGORIES);
      expect(actions[1].type).toBe(SET_VIEW_TITLE);
    });
  });
});
