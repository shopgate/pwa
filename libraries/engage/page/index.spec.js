import * as page from '.';

describe('engage > page', () => {
  it('should have exports', () => {
    expect(typeof page).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(page).forEach((exportKey) => {
      expect(typeof page[exportKey] !== 'undefined').toBe(true);
    });
  });
});
