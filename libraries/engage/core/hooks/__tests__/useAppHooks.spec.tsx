import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render } from '@testing-library/react';
import { useAppDispatch } from '../useAppDispatch';
import { useAppSelector } from '../useAppSelector';
import type { AppThunk } from '../../types';

describe('useAppDispatch() and useAppSelector()', () => {
  it('should select from the store and return what a dispatched thunk returns', () => {
    const store = createStore(() => ({ extensions: { example: { value: 'selected' } } }));
    const thunk: AppThunk<string> = (dispatch, getState) => (
      typeof getState().extensions === 'object' ? 'returned' : 'missing'
    );
    let selected: unknown;
    let returned: string | undefined;

    /**
     * Uses both hooks.
     * @returns Nothing.
     */
    const Component = () => {
      const dispatch = useAppDispatch();
      selected = useAppSelector(state => (state.extensions.example as { value: string }).value);
      returned = dispatch(thunk);
      return null;
    };

    const thunkStore = Object.assign(store, {
      dispatch: (action: unknown) => (typeof action === 'function'
        ? action(store.dispatch, store.getState)
        : action),
    });

    render(<Provider store={thunkStore}><Component /></Provider>);

    expect(selected).toBe('selected');
    expect(returned).toBe('returned');
  });
});
