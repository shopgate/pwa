import * as actionCreators from '../index';

describe('engage > locations > action-creators', () => {
  it('should have exports', () => {
    expect(typeof actionCreators).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(actionCreators).forEach((exportKey) => {
      expect(typeof actionCreators[exportKey] !== 'undefined').toBe(true);
    });
  });
});
