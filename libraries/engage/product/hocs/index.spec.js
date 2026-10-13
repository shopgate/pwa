describe('engage > product > hocs', () => {
  it('should be loadable before the index of the product module', () => {
    let hocs;

    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      hocs = require('./index');
    });

    expect(Object.keys(hocs).sort()).toEqual([
      'withMapPricing',
      'withPriceCalculation',
      'withProductListEntry',
      'withProductListEntryProduct',
      'withProductListType',
      'withProductStock',
    ]);
    Object.values(hocs).forEach((hoc) => {
      expect(typeof hoc).toBe('function');
    });
  });
});
