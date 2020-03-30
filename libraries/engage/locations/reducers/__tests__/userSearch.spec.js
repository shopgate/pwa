import '../../action-creators/__mocks__';
import {
  setUserSearchPostalCode,
  setUserSearchCountryCode,
} from '../../action-creators';
import reducer, { defaultState } from '../userSearch';

describe('engage > locations > reducers > userSearch', () => {
  let state;

  beforeEach(() => {
    state = reducer(state, {});
  });

  test('initial state', () => {
    expect(state).toEqual(defaultState);
  });

  test('setUserSearchPostalCode with a string', () => {
    const postalCode = '35510';
    state = reducer(state, setUserSearchPostalCode(postalCode));
    expect(state).toEqual({
      ...defaultState,
      postalCode,
    });
  });

  test('setUserSearchPostalCode with null', () => {
    const postalCode = null;
    state = reducer(state, setUserSearchPostalCode(postalCode));
    expect(state).toEqual({
      ...defaultState,
      postalCode,
    });
  });

  test('setUserSearchCountryCode', () => {
    const countryCode = 'DE';
    state = reducer(state, setUserSearchCountryCode(countryCode));
    expect(state).toEqual({
      ...defaultState,
      countryCode,
    });
  });
});
