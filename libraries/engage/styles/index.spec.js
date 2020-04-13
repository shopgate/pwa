import * as styles from '.';

describe('engage > styles', () => {
  it('should have exports', () => {
    expect(typeof styles).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(styles).forEach((exportKey) => {
      expect(typeof styles[exportKey] !== 'undefined').toBe(true);
    });
  });
});
