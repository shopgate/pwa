import '../../action-creators/__mocks__';
import { receiveLocations } from '../../action-creators';
import reducer from '../locationsById';

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
    });
  });
});
