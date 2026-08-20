/**
 * Minimal Redux store for component tests.
 *
 * This module is only meant to be imported from test files, since it uses the jest globals.
 */
import type { Observable, Reducer, Store } from 'redux';

type Listener = () => void;

/**
 * Symbol.observable is not part of the language, so redux resolves it with a string fallback. The
 * same fallback is needed here - without it the computed property key would be undefined, and the
 * store wouldn't fulfill the contract it claims to.
 */
const $$observable = ((typeof Symbol === 'function' && Symbol.observable)
  || '@@observable') as typeof Symbol.observable;

/** An action which was dispatched to the store. */
export interface MockAction {
  type: string;
  [key: string]: unknown;
}

/** Reducer which is applied to the dispatched actions. */
export type MockReducer<S> = (state: S, action: MockAction) => S;

/**
 * A store which satisfies the Store contract of redux, so that it can be passed to the Provider
 * of react-redux without a cast, extended by the helpers which are useful within tests.
 */
export interface MockStore<S> extends Store<S, MockAction> {
  /** Records every dispatched action. Assert on it like on any other jest mock. */
  dispatch: jest.Mock<MockAction, [MockAction]> & Store<S, MockAction>['dispatch'];
  /** Replaces the state and notifies the subscribers, so connected components re-render. */
  setState: (next: S | ((current: S) => S)) => void;
  /** Returns the dispatched actions in the order they were dispatched. */
  getActions: () => MockAction[];
  /** Forgets all recorded actions. */
  clearActions: () => void;
}

/**
 * Creates a Redux store for component tests. It implements the contract that react-redux relies on
 * - getState, dispatch and subscribe - without pulling in the reducers of the application.
 *
 * By default dispatched actions are only recorded, which keeps the state predictable while
 * asserting that a component dispatches the right action. Pass a reducer to also apply the
 * dispatched actions to the state, e.g. to assert what a component renders afterwards.
 * @param initialState The state the store starts with.
 * @param reducer Optional reducer which is applied to dispatched actions.
 * @returns The mocked store.
 */
export const createMockStore = <S>(
  initialState: S,
  reducer?: MockReducer<S>
): MockStore<S> => {
  let state = initialState;
  let currentReducer = reducer;
  const listeners = new Set<Listener>();

  /**
   * Notifies all subscribers about a state change.
   */
  const notify = (): void => {
    listeners.forEach((listener) => {
      listener();
    });
  };

  const dispatch = jest.fn((action: MockAction): MockAction => {
    if (currentReducer) {
      state = currentReducer(state, action);
      notify();
    }

    return action;
  });

  const subscribe = (listener: Listener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  const getState = () => state;

  /**
   * Part of the redux Store contract. Tests don't observe the store, so this only satisfies the
   * interface.
   * @returns The observable of the store.
   */
  const observable = (): Observable<S> => ({
    subscribe: (observer) => {
      /**
       * Forwards the current state to the observer.
       */
      const handleChange = () => {
        if (observer.next) {
          observer.next(getState());
        }
      };

      handleChange();

      return { unsubscribe: subscribe(handleChange) };
    },
    [$$observable]() {
      return this;
    },
  } as Observable<S>);

  /**
   * redux declares Symbol.observable as a plain symbol, so TypeScript widens the computed key to
   * a symbol index and can't verify that this exact member is implemented. The assertion is only
   * needed for that key - the store is verified against the contract in the spec.
   */
  return {
    getState,
    dispatch: dispatch as MockStore<S>['dispatch'],
    subscribe,
    replaceReducer: (nextReducer: Reducer<S, MockAction>) => {
      currentReducer = nextReducer as MockReducer<S>;
      notify();
    },
    [$$observable]: observable,
    setState: (next: S | ((current: S) => S)) => {
      state = typeof next === 'function' ? (next as (current: S) => S)(state) : next;
      notify();
    },
    getActions: () => dispatch.mock.calls.map(([action]) => action),
    clearActions: () => {
      dispatch.mockClear();
    },
  } as unknown as MockStore<S>;
};
