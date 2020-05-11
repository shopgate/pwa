import '../../action-creators/__mocks__';
import { receiveLocations } from '../../action-creators';
import reducer, { CACHE_TIME } from '../locationsById';

const getTimeResult = 0;
/* eslint-disable require-jsdoc */
global.Date = class {
  static now() {
    return getTimeResult;
  }
};
/* eslint-enable require-jsdoc */

describe('engage > locations > reducers > locationsById', () => {
  let state;

  test('initialState', () => {
    state = reducer(state, {});
    expect(state).toEqual({});
  });

  test('receiveLocations', () => {
    state = reducer(state, receiveLocations([{
      code: 'code1',
      name: 'Code 1',
      addresses: [{
        street: 'Street',
        isPrimary: true,
      }],
    }]));
    expect(state).toEqual({
      code1: {
        expires: CACHE_TIME,
        isFetching: false,
        location: {
          code: 'code1',
          name: 'Code 1',
          addresses: [{
            street: 'Street',
            isPrimary: true,
          }],
          address: {
            street: 'Street',
            isPrimary: true,
          },
        },
      },
    });
  });
});
