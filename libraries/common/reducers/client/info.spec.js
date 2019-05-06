import {
  REQUEST_CLIENT_INFORMATION,
  RECEIVE_CLIENT_INFORMATION,
  ERROR_CLIENT_INFORMATION,
} from '../../constants/ActionTypes';
import reducer from './info';

const mockState = {
  libVersion: '17.0',
  data: {},
  isFetching: false,
};

describe('Client information reducer', () => {
  it('should return the default state when no previous state is present, and no action type was passed', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual({});
  });

  it('should return the previous state when no action type was passed', () => {
    const previous = {
      ...mockState,
    };

    const state = reducer(previous, {});
    expect(state).toBe(previous);
  });

  it('should set isFetching to TRUE at REQUEST_CLIENT_INFORMATION ', () => {
    const previous = {
      libVersion: '17.0',
      isFetching: false,
    };

    const expected = {
      libVersion: '17.0',
      isFetching: true,
    };

    const state = reducer(previous, {
      type: REQUEST_CLIENT_INFORMATION,
      data: {
        libVersion: '17.0',
      },
    });

    expect(state).toEqual(expected);
  });

  it('should set isFetching to FALSE at RECEIVE_CLIENT_INFORMATION ', () => {
    const previous = {
      libVersion: '17.0',
      isFetching: true,
    };
    const expected = {
      libVersion: '21.0',
      isFetching: false,
    };

    const state = reducer(previous, {
      type: RECEIVE_CLIENT_INFORMATION,
      data: {
        libVersion: '21.0',
      },
    });

    expect(state).toEqual(expected);
  });

  it('should set isFetching to FALSE at ERROR_CLIENT_INFORMATION ', () => {
    const previous = {
      libVersion: '17.0',
      isFetching: true,
    };
    const expected = {
      libVersion: '17.0',
      isFetching: false,
    };

    const state = reducer(previous, {
      type: ERROR_CLIENT_INFORMATION,
      data: {
        libVersion: '21.0',
      },
    });

    expect(state).toEqual(expected);
  });
});
