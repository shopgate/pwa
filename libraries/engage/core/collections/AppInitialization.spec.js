/* eslint-disable require-jsdoc */
import { combineReducers } from 'redux';
import { createMockStore } from '@shopgate/engage/core';
import appInitialization from './AppInitialization';

const SET_INITIALIZED = 'SET_INITIALIZED';

const defaultState = {
  initialized: false,
  otherValue: 'ACME',
};

/**
 * Mocked reducer for the test
 * @param {Object} state Reducer state
 * @param {Object} action Redux action
 * @returns {Object}
 */
const mockReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_INITIALIZED: {
      return {
        ...state,
        initialized: action.initialized,
      };
    }
    default:
      return state;
  }
};

describe('AppInitialization collection', () => {
  let dispatch;
  let getState;

  beforeEach(() => {
    jest.clearAllMocks();

    appInitialization.constructor();

    const store = createMockStore(
      combineReducers({ mockReducer })
    );

    jest.spyOn(store, 'dispatch');
    jest.spyOn(store, 'getState');

    ({ dispatch, getState } = store);
  });

  describe('.get()', () => {
    it('should return "undefined" for a not existing identifier', () => {
      expect(appInitialization.get('not-existing')).toBeUndefined();
    });

    it('should return the registered handler', () => {
      const handler = () => {};
      appInitialization.set('identifier', handler);
      expect(appInitialization.get('identifier')).toEqual(handler);
    });
  });

  describe('.set()', () => {
    it('should register a handler and return the collection instance', () => {
      const handler = () => {};
      expect(appInitialization.set('identifier', handler)).toEqual(appInitialization);
      expect(appInitialization.get('identifier')).toEqual(handler);
    });
  });

  describe('.initialize()', () => {
    it('should handle registered handlers as expected', async () => {
      const promiseResolveHandler = () => new Promise((resolve) => {
        resolve(42);
      });

      const promiseRejectError = new Error('Promise Reject');
      const promiseRejectHandler = () => new Promise((resolve, reject) => {
        reject(promiseRejectError);
      });

      const primitiveHandler = async () => 23;

      const erroneousHandler = () => {
        throw new Error('My Error');
      };

      appInitialization.set('promiseResolveHandler', promiseResolveHandler);
      appInitialization.set('promiseRejectHandler', promiseRejectHandler);
      appInitialization.set('primitiveHandler', primitiveHandler);
      appInitialization.set('erroneousHandler', erroneousHandler);

      const result = await appInitialization.initialize({
        dispatch,
        getState,
      });

      expect(result).toEqual({
        results: [42, 23],
        errors: [promiseRejectError],
      });
    });

    it('should update redux when handlers dispatch actions', async () => {
      expect.assertions(6);

      const action = {
        type: SET_INITIALIZED,
        initialized: true,
      };

      const handler = ({ dispatch: dispatchFn, getState: getStateFn }) => new Promise((resolve) => {
        expect(getStateFn()).toEqual({
          mockReducer: defaultState,
        });
        dispatchFn(action);
        resolve(42);
      });

      appInitialization.set('mock-handler', handler);

      const result = await appInitialization.initialize({
        dispatch,
        getState,
      });

      expect(result).toEqual({
        results: [42],
        errors: [],
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(action);
      expect(getState).toHaveBeenCalledTimes(1);

      expect(getState()).toEqual({
        mockReducer: {
          ...defaultState,
          initialized: true,
        },
      });
    });
  });
});

/* eslint-enable require-jsdoc */
