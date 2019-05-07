import { RECEIVE_CLIENT_CONNECTIVITY } from '../../constants/ActionTypes';
import {
  CONNECTIVITY_NETWORK_UNKNOWN,
  CONNECTIVITY_TYPE_UNKNOWN,
  CONNECTIVITY_TYPE_WIFI,
} from '../../constants/client';

import reducer from './connectivity';

describe('Client connectivity reducer', () => {
  it('should return the default state when no previous state is present, and no action type was passed', () => {
    const state = reducer(undefined, {});
    const expected = {
      connected: true,
      network: CONNECTIVITY_NETWORK_UNKNOWN,
      type: CONNECTIVITY_TYPE_UNKNOWN,
    };

    expect(state).toEqual(expected);
  });

  it('should return the state when no action type was passed', () => {
    const previous = {
      connected: false,
      network: CONNECTIVITY_TYPE_WIFI,
      type: CONNECTIVITY_TYPE_WIFI,
    };

    const state = reducer(previous, {});
    expect(state).toBe(previous);
  });

  it('should update the state at RECEIVE_CLIENT_CONNECTIVITY ', () => {
    const previous = {
      connected: false,
      network: CONNECTIVITY_NETWORK_UNKNOWN,
      type: CONNECTIVITY_TYPE_UNKNOWN,
    };

    const updated = {
      connected: true,
      network: CONNECTIVITY_TYPE_WIFI,
      type: CONNECTIVITY_TYPE_WIFI,
    };

    const state = reducer(previous, {
      data: {
        ...updated,
      },
      type: RECEIVE_CLIENT_CONNECTIVITY,
    });

    expect(state).toEqual(updated);
  });

  it('should update the state at RECEIVE_CLIENT_CONNECTIVITY when only the connected property is present in the action data', () => {
    const previous = {
      connected: true,
      network: CONNECTIVITY_TYPE_WIFI,
      type: CONNECTIVITY_TYPE_WIFI,
    };

    const expected = {
      connected: false,
      network: CONNECTIVITY_NETWORK_UNKNOWN,
      type: CONNECTIVITY_TYPE_UNKNOWN,
    };

    const state = reducer(previous, {
      data: {
        connected: false,
      },
      type: RECEIVE_CLIENT_CONNECTIVITY,
    });

    expect(state).toEqual(expected);
  });
});
