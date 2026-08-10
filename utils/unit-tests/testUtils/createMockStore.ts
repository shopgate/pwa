/**
 * Minimal Redux store for component tests.
 *
 * This module is only meant to be imported from test files, since it uses the jest globals.
 */

type Listener = () => void;

/** An action which was dispatched to the store. */
export interface MockAction {
  type: string;
  [key: string]: unknown;
}

/** Reducer which is applied to the dispatched actions. */
export type MockReducer<S> = (state: S, action: MockAction) => S;

export interface MockStore<S> {
  /** Returns the current state. */
  getState: () => S;
  /** Records every dispatched action. Assert on it like on any other jest mock. */
  dispatch: jest.Mock<MockAction, [MockAction]>;
  /** Registers a listener which is invoked whenever the state changed. Returns an unsubscribe. */
  subscribe: (listener: Listener) => () => void;
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
    if (reducer) {
      state = reducer(state, action);
      notify();
    }

    return action;
  });

  return {
    getState: () => state,
    dispatch,
    subscribe: (listener: Listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    setState: (next) => {
      state = typeof next === 'function' ? (next as (current: S) => S)(state) : next;
      notify();
    },
    getActions: () => dispatch.mock.calls.map(([action]) => action),
    clearActions: () => {
      dispatch.mockClear();
    },
  };
};
