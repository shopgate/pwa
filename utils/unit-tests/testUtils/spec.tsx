/* eslint-disable extra-rules/no-single-line-objects */
import React from 'react';
import { mount } from 'enzyme';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createMockStore } from './createMockStore';
import type { MockAction } from './createMockStore';

interface TestState {
  counter: number;
}

/**
 * Component which reads from and dispatches to the store, to verify that the mocked store
 * satisfies what react-redux expects from a store.
 * @returns The rendered component.
 */
const Counter = () => {
  const counter = useSelector((state: TestState) => state.counter);
  const dispatch = useDispatch();

  return (
    <button type="button" onClick={() => dispatch({ type: 'INCREMENT' })}>
      {counter}
    </button>
  );
};

/**
 * Reducer which increments the counter.
 * @param state The current state.
 * @param action The dispatched action.
 * @returns The new state.
 */
const reducer = (state: TestState, action: MockAction): TestState =>
  (action.type === 'INCREMENT' ? { counter: state.counter + 1 } : state);

describe('createMockStore()', () => {
  it('should expose the initial state', () => {
    expect(createMockStore({ counter: 1 }).getState()).toEqual({ counter: 1 });
  });

  it('should record dispatched actions', () => {
    const store = createMockStore({ counter: 0 });

    store.dispatch({ type: 'FIRST' });
    store.dispatch({ type: 'SECOND', payload: 42 });

    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.getActions()).toEqual([
      { type: 'FIRST' },
      { type: 'SECOND', payload: 42 },
    ]);
  });

  it('should forget recorded actions', () => {
    const store = createMockStore({ counter: 0 });

    store.dispatch({ type: 'FIRST' });
    store.clearActions();

    expect(store.getActions()).toEqual([]);
  });

  it('should not change the state without a reducer', () => {
    const store = createMockStore({ counter: 0 });

    store.dispatch({ type: 'INCREMENT' });

    expect(store.getState()).toEqual({ counter: 0 });
  });

  it('should notify subscribers when the state is replaced', () => {
    const store = createMockStore({ counter: 0 });
    const listener = jest.fn();

    store.subscribe(listener);
    store.setState({ counter: 5 });

    expect(store.getState()).toEqual({ counter: 5 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should support updating the state based on the current one', () => {
    const store = createMockStore({ counter: 1 });

    store.setState(current => ({ counter: current.counter + 1 }));

    expect(store.getState()).toEqual({ counter: 2 });
  });

  it('should stop notifying after unsubscribing', () => {
    const store = createMockStore({ counter: 0 });
    const listener = jest.fn();

    store.subscribe(listener)();
    store.setState({ counter: 1 });

    expect(listener).not.toHaveBeenCalled();
  });

  it('should apply dispatched actions to the state when a reducer is passed', () => {
    const store = createMockStore({ counter: 0 }, reducer);

    store.dispatch({ type: 'INCREMENT' });

    expect(store.getState()).toEqual({ counter: 1 });
  });

  describe('within react-redux', () => {
    it('should provide the state to a connected component', () => {
      const store = createMockStore<TestState>({ counter: 7 });

      const wrapper = mount(
        <Provider store={store as never}>
          <Counter />
        </Provider>
      );

      expect(wrapper.find('button').text()).toBe('7');
    });

    it('should record actions which a connected component dispatches', () => {
      const store = createMockStore<TestState>({ counter: 0 });

      mount(
        <Provider store={store as never}>
          <Counter />
        </Provider>
      ).find('button').simulate('click');

      expect(store.getActions()).toEqual([{ type: 'INCREMENT' }]);
    });

    it('should re-render a connected component when the state changes', () => {
      const store = createMockStore<TestState>({ counter: 0 }, reducer);

      const wrapper = mount(
        <Provider store={store as never}>
          <Counter />
        </Provider>
      );

      wrapper.find('button').simulate('click');

      expect(wrapper.find('button').text()).toBe('1');
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
