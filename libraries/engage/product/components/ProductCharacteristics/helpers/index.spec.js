/* eslint-disable extra-rules/no-single-line-objects,global-require */

const products = [{
  id: '007-001',
  characteristics: {
    1: '1', 2: '1', 3: '1', // equals L, Black, None
  },
}, {
  id: '007-002',
  characteristics: {
    1: '1', 2: '2', 3: '1', // equals L, Blue, None
  },
}, {
  id: '007-003',
  characteristics: {
    1: '1', 2: '2', 3: '3', // equals L, Blue, Stripes
  },
}, {
  id: '007-004',
  characteristics: {
    1: '2', 2: '2', 3: '3', // equals XL, Blue, Stripes
  },
}];

const characteristics = [{
  id: '1',
  label: 'Size',
  values: [
    { id: '0', label: 'Resilient' },
    { id: '1', label: 'L' },
    { id: '2', label: 'XL' },
  ],
}, {
  id: '2',
  label: 'Color',
  values: [
    { id: '0', label: 'Transparent' },
    { id: '1', label: 'Black' },
    { id: '2', label: 'Blue' },
  ],
}, {
  id: '3',
  label: 'Pattern',
  values: [
    { id: '0', label: 'No pattern' },
    { id: '1', label: 'None' },
    { id: '2', label: 'Checked' },
    { id: '3', label: 'Stripes' },
  ],
}];

describe('ProductCharacteristics helpers', () => {
  afterEach(() => {
    jest.resetModules();
  });

  describe('findSelectionIndex()', () => {
    const { findSelectionIndex } = require('./index');

    it('should return the index', () => {
      expect(findSelectionIndex(characteristics, '2')).toBe(1);
    });

    it('should return -1 when the the characteristic was not found', () => {
      expect(findSelectionIndex(characteristics, '5')).toBe(-1);
    });
  });

  describe('prepareState()', () => {
    const { prepareState } = require('./index');

    it('should return the current selections, when the selected ID is not found', () => {
      const selections = { 1: '1', 2: '1', 3: '1' };
      const result = prepareState('4', '2', selections, characteristics, products);
      expect(result).toEqual(selections);
    });

    it('should return partial states when a full selection was not selected yet', () => {
      const selections = {};

      // L
      let result = prepareState('1', '1', selections, characteristics, products);
      expect(result).toEqual({
        1: '1',
      });

      // equals L, Blue
      result = prepareState('2', '2', result, characteristics, products);
      expect(result).toEqual({
        1: '1',
        2: '2',
      });

      // equals L, Blue, Stripes
      result = prepareState('3', '3', result, characteristics, products);
      expect(result).toEqual({
        1: '1',
        2: '2',
        3: '3',
      });
    });

    it('should return a full selections object when the middle selection was changed, but there is a product for the resulting selections', () => {
      // L, Black, None => L, Blue, None
      const selections = { 1: '1', 2: '1', 3: '1' };
      const result = prepareState('2', '2', selections, characteristics, products);
      expect(result).toEqual({
        1: '1',
        2: '2',
        3: '1',
      });
    });

    it('should return a full selections object when there is only one product that matches the selected characteristics', () => {
      // XL => XL, Blue, Stripes
      const selections = {};
      const result = prepareState('1', '2', selections, characteristics, products);
      expect(result).toEqual({
        1: '2',
        2: '2',
        3: '3',
      });
    });

    it('should not reset when a value of the last selection is changed', () => {
      // L, Blue, None => L, Blue, Stripes
      const selections = { 1: '1', 2: '2', 3: '1' };
      const result = prepareState('3', '3', selections, characteristics, products);
      expect(result).toEqual({
        1: '1',
        2: '2',
        3: '3',
      });
    });

    it('should reset the last selection when the middle selection was changed, but there is no matching product', () => {
      // L, Black, Checked => L, Blue
      const selections = { 1: '1', 2: '1', 3: '2' };
      const result = prepareState('2', '2', selections, characteristics, products);
      expect(result).toEqual({
        1: '1',
        2: '2',
      });
    });
  });

  describe('selectCharacteristics()', () => {
    describe('default config', () => {
      const { selectCharacteristics } = require('./index');

      it('should return empty characteristics', () => {
        expect(selectCharacteristics({})).toEqual({});
      });

      it('should return characteristics for selected variant', () => {
        expect(selectCharacteristics({ variantId: '007-001', variants: { products } }))
          .toEqual(products[0].characteristics);
      });

      it('should preselect characteristics for only 1 variant', () => {
        expect(selectCharacteristics({ variants: { products: [products[0]] } }))
          .toEqual(products[0].characteristics);
      });

      it('should not preselect characteristics by config', () => {
        expect(selectCharacteristics({ variants: { products } })).toEqual({});
      });
    });

    describe('preselect config', () => {
      jest.doMock('@shopgate/pwa-common/helpers/config', () => ({
        product: { variantPreselect: true },
      }));
      it('should preselect characteristics for selectable product', () => {
        const { selectCharacteristics: selectCharacteristicsPreselect } = require('./index');
        expect(selectCharacteristicsPreselect({ variants: { characteristics, products } }))
          .toEqual(products[0].characteristics);
      });
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects,global-require */
