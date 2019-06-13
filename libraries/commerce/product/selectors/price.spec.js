import {
  getProductUnitPrice,
  getProductCurrency,
} from './product';
import {
  getRawProductOptions,
  getProductOptions,
} from './options';
import {
  getProductPriceAddition,
  getProductTotalPrice,
  isFullPriceAvailable,
} from './price';
import {
  basicProductState,
  productWithOneOption,
  productWithSelectedOptions,
  productWithVariants,
  productWithSelectedVariant,
  productWithVariantsAndOptions,
} from './../mock';

describe('Product.Price selectors', () => {
  describe('Simple data selectors', () => {
    it('should validate simple data selectors', () => {
      expect(getProductUnitPrice(basicProductState, { productId: '913' })).toBe(89);
      expect(getProductCurrency(basicProductState, { productId: '913' })).toBe('EUR');
    });
  });

  describe('Additional price calculation', () => {
    it('should calculate no additional costs for a basic product', () => {
      expect(getProductPriceAddition(basicProductState, { productId: '913' })).toBe(0);
      expect(getProductTotalPrice(basicProductState, { productId: '913' })).toBe(89);
    });

    it('should calculate no additional cost when no options are selected', () => {
      expect(getProductPriceAddition(productWithOneOption, { productId: '1097' })).toBe(0);
      expect(getProductTotalPrice(productWithOneOption, { productId: '1097' })).toBe(10);
    });

    it('should calculate additional cost when one option is selected', () => {
      const props = {
        productId: '1097',
        options: {
          1: '1', // select option
          10: 'Foo bar', // text option
        },
      };

      expect(getProductPriceAddition(productWithSelectedOptions, props)).toBe(4);
      expect(getProductTotalPrice(productWithSelectedOptions, props)).toBe(14);
    });

    it('should calculate no additional cost for a product with just variants', () => {
      expect(getProductPriceAddition(productWithSelectedVariant, { productId: 'dif01-exp' })).toBe(0);
      expect(getProductTotalPrice(productWithSelectedVariant, { productId: 'dif01-exp' })).toBe(26);
    });
  });

  describe('Min price calculation', () => {
    it('price should be available for a basic product', () => {
      expect(isFullPriceAvailable(basicProductState, { productId: '913' })).toBe(true);
    });

    it('price should not be available for a product with unselected options', () => {
      const props = {
        productId: '1097',
        options: {},
      };
      expect(isFullPriceAvailable(productWithOneOption, props)).toBe(false);
    });

    it('price should be available for a product with selected options', () => {
      const props = {
        productId: '1097',
        options: {
          1: '1',
          10: 'Foo bar',
        },
      };

      expect(isFullPriceAvailable(productWithSelectedOptions, props)).toBe(true);
    });

    it('price should not be available for a product with unselected variants', () => {
      expect(isFullPriceAvailable(productWithVariants, { productId: 'dif01' })).toBe(false);
    });

    it('price should be available for a product with selected variants', () => {
      expect(isFullPriceAvailable(productWithSelectedVariant, { productId: 'dif01-exp' })).toBe(true);
    });
  });

  /**
   * Checks:
   * - Product Options are remembered across variants.
   * - From price should be used when the selection is not complete.
   * - Additional price should be available after selecting an option.
   * - Total price should be always the additional price + base price.
   * - Additional costs per item are correct.
   */
  describe('Scenario #1: Product with variants and options', () => {
    const state = productWithVariantsAndOptions;

    it('Step 1: Opening the product', () => {
      const props = {
        productId: 'SG74',
        productVariantId: null,
        currentOptions: {},
      };

      // No additional price can be calculated at the moment.
      expect(getProductPriceAddition(state, props)).toBe(0);
      expect(getProductTotalPrice(state, props)).toBe(10.51);
      expect(isFullPriceAvailable(state, props)).toBe(false);

      // No product options can be found since they are on the variant only.
      expect(getRawProductOptions(state, props)).toBeFalsy();
    });

    it('Step 2: Select a children/variant', () => {
      const props = {
        productId: 'SG74',
        variantId: 'SG76',
        currentOptions: {},
      };

      // Additional price can still not be calculated because options are not available.
      expect(getProductPriceAddition(state, props)).toBe(0);
      expect(getProductTotalPrice(state, props)).toBe(10.52);
      expect(isFullPriceAvailable(state, props)).toBe(false);

      // Product options are now available.
      expect(getRawProductOptions(state, props).length).toBe(1);

      // Peak into the calculated relative additional price differences.
      // Price modifiers stay constant, because they're absolute.
      // Price modifier and difference is equal when nothing is selected, yet
      const availableOptions = getProductOptions(state, props);
      expect(availableOptions[0].items[0].price).toBe(5);
      expect(availableOptions[0].items[0].priceDifference).toBe(5);
      expect(availableOptions[0].items[1].price).toBe(4);
      expect(availableOptions[0].items[1].priceDifference).toBe(4);
    });

    it('Step 3: Select the option', () => {
      const props = {
        productId: 'SG74',
        variantId: 'SG76',
        options: {
          1: '5',
        },
        currentOptions: {
          1: '5',
        },
      };

      // Additional price can now be calculated.
      expect(getProductPriceAddition(state, props)).toBe(5);
      expect(getProductTotalPrice(state, props)).toBe(15.52);

      // Peak into the calculated relative additional price differences.
      // Price modifiers stay constant, because they're absolute.
      // Price modifiers stay constant, because they're absolute.
      const availableOptions = getProductOptions(state, props);
      expect(availableOptions[0].items[0].price).toBe(5);
      expect(availableOptions[0].items[0].priceDifference).toBe(0);
      expect(availableOptions[0].items[1].price).toBe(4);
      expect(availableOptions[0].items[1].priceDifference).toBe(-1);
      expect(isFullPriceAvailable(state, props)).toBe(true);
    });

    it('Step 4: Change to a different variant', () => {
      const props = {
        productId: 'SG74',
        variantId: 'SG78',
        options: {
          1: '5',
        },
        currentOptions: {
          1: '5',
        },
      };

      // Additional price should still be calculated
      expect(getProductPriceAddition(state, props)).toBe(5);
      expect(getProductTotalPrice(state, props)).toBe(15.54);
      expect(isFullPriceAvailable(state, props)).toBe(true);

      // Product options are still available.
      expect(getRawProductOptions(state, props).length).toBe(1);
    });
  });
});
