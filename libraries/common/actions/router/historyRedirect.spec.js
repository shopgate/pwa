import {
  historyPop,
  historyReplace,
  historyRedirect,
} from './index';

jest.mock('./historyPop');
jest.mock('./historyReplace');

describe('historyRedirect action', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pop when no params where passed', () => {
    const thunk = historyRedirect();

    thunk(dispatch);

    expect(historyPop).toHaveBeenCalledTimes(1);
  });

  it('should pop when no location was passed', () => {
    const thunk = historyRedirect({ some: 'prop' });
    thunk(dispatch);

    expect(historyPop).toHaveBeenCalledTimes(1);
  });

  it('should replace when a location was passed', () => {
    const location = '/some_route';
    const thunk = historyRedirect({ location });
    thunk(dispatch);

    expect(historyReplace).toHaveBeenCalledTimes(1);
    expect(historyReplace).toHaveBeenCalledWith({
      pathname: location,
      state: {},
    });
  });

  it('should replace when a location and a state was passed', () => {
    const location = '/some_route';
    const state = { some: 'prop' };
    const thunk = historyRedirect({
      location,
      state,
    });
    thunk(dispatch);

    expect(historyReplace).toHaveBeenCalledTimes(1);
    expect(historyReplace).toHaveBeenCalledWith({
      pathname: location,
      state,
    });
  });
});
