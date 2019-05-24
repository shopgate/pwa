import configuration from '../collections/Configuration';
import { RESET_APP } from '../constants/ActionTypes';
import makeRootReducer from './index';

describe('makeRootReducer', () => {
  const state = {};
  const action = { type: RESET_APP };

  let appReducers;
  let rootReducer;

  beforeEach(() => {
    appReducers = jest.fn();
    rootReducer = makeRootReducer(appReducers);
    state.app = {};
    state.view = {};
  });

  it('should pass state to app reducers', () => {
    rootReducer(state, action);

    const [[arg1, arg2]] = appReducers.mock.calls;
    expect(arg1).toBe(state);
    expect(arg2).toBe(action);
  });

  it('should reset default reducers from config', () => {
    const spy = jest.spyOn(configuration, 'get').mockReturnValueOnce(['view']);

    rootReducer(state, action);

    const [[arg1, arg2]] = appReducers.mock.calls;

    expect(spy).toBeCalledTimes(1);
    expect(arg1).toBe(state);
    expect(arg2).toBe(action);
    // eslint-disable-next-line extra-rules/no-single-line-objects
    expect(arg1).toEqual({ app: {}, view: undefined });
  });

  it('should reset reducers from action', () => {
    // eslint-disable-next-line extra-rules/no-single-line-objects
    const resetAction = { type: RESET_APP, reducers: ['app'] };

    rootReducer(state, resetAction);
    const [[arg1, arg2]] = appReducers.mock.calls;

    expect(arg1).toBe(state);
    expect(arg2).toBe(resetAction);

    // eslint-disable-next-line extra-rules/no-single-line-objects
    expect(arg1).toEqual({ app: undefined, view: {} });
  });

  it('should skip unknown reducers', () => {
    // eslint-disable-next-line extra-rules/no-single-line-objects
    const resetAction = { type: RESET_APP, reducers: ['foobar'] };

    rootReducer(state, resetAction);
    const [[arg1, arg2]] = appReducers.mock.calls;

    expect(arg1).toBe(state);
    expect(arg2).toBe(resetAction);

    // eslint-disable-next-line extra-rules/no-single-line-objects
    expect(arg1).toEqual({ app: {}, view: {} });
  });
});
