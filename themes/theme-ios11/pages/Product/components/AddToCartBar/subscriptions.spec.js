import configureStore from 'redux-mock-store';
import reducer from './reducer';
import addToCartBar from './subscriptions';
import {
  DECREMENT_ACTION_COUNT,
  INCREMENT_ACTION_COUNT,
  RESET_ACTION_COUNT,
} from './constants';

const mockedState = {
  ui: {
    addToCartBar: {
      added: 2,
    },
  },
};
const mockedStore = configureStore();

describe('AddToCartBar subscriptions and actions', () => {
  let subscribeMock;
  let store;

  beforeAll(() => {
    subscribeMock = jest.fn();
  });

  it('should handle subscribers', () => {
    addToCartBar(subscribeMock);

    // Check all the subscribers
    expect(subscribeMock.mock.calls.length).toBe(5);

    subscribeMock.mock.calls.forEach((mock) => {
      store = mockedStore(mockedState);
      // Execute the subscription method
      mock[1](store);

      const actions = store.getActions();
      const state = reducer(store.getState().ui.addToCartBar, actions[0]);

      if (actions[0].type === INCREMENT_ACTION_COUNT) {
        expect(state.added).toEqual(3);
      }

      if (actions[0].type === DECREMENT_ACTION_COUNT) {
        expect(state.added).toEqual(1);
      }

      if (actions[0].type === RESET_ACTION_COUNT) {
        expect(state.added).toEqual(0);
      }
    });
  });

  it('should handle default state', () => {
    const stateDefault = reducer(undefined, { type: 'foo' });
    expect(stateDefault.added).toEqual(0);

    store = mockedStore(mockedState);
    const stateReturn = reducer(store.getState().ui.addToCartBar, { type: 'foo' });
    expect(stateReturn.added).toEqual(store.getState().ui.addToCartBar.added);
  });
});
