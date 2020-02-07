import { requestConfig, receiveConfig, errorConfig } from '../config.action-creators';
import reducers from '../config.reducers';

describe('engage > core > config > reducers', () => {
  let state;

  test('initialState', () => {
    state = reducers(state, {});
    expect(state).toEqual({});
  });

  test('requestConfig', () => {
    state = reducers(state, requestConfig());
    expect(state).toEqual({
      expires: 0,
      isFetching: true,
    });
  });

  test('receiveConfig', () => {
    state = reducers(state, receiveConfig({
      merchantSettings: {
        foo: 'bar',
      },
    }));
    expect(state).toEqual(expect.objectContaining({
      isFetching: false,
      merchantSettings: {
        foo: 'bar',
      },
    }));
  });

  test('errorConfig', () => {
    state = reducers(state, errorConfig(new Error('Pipeline failed')));
    expect(state).toEqual({
      expires: 0,
      isFetching: false,
      merchantSettings: {
        foo: 'bar',
      },
    });
  });
});
