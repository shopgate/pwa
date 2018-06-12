import { createStore, combineReducers } from 'redux';
import reducers from '../reducers';
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
import setProductVariantId from '../action-creators/setProductVariantId';
import setProductOption from '../action-creators/setProductOption';
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
      expect(getProductUnitPrice(basicProductState)).toBe(89);
      expect(getProductCurrency(basicProductState)).toBe('EUR');
    });
  });

  describe('Additional price calculation', () => {
    it('should calculate no additional costs for a basic product', () => {
      expect(getProductPriceAddition(basicProductState)).toBe(0);
      expect(getProductTotalPrice(basicProductState)).toBe(89);
    });

    it('should calculate no additional cost when no options are selected', () => {
      expect(getProductPriceAddition(productWithOneOption)).toBe(0);
      expect(getProductTotalPrice(productWithOneOption)).toBe(10);
    });

    it('should calculate additional cost when one option is selected', () => {
      expect(getProductPriceAddition(productWithSelectedOptions)).toBe(1);
      expect(getProductTotalPrice(productWithSelectedOptions)).toBe(11);
    });

    it('should calculate no additional cost for a product with just variants', () => {
      expect(getProductPriceAddition(productWithSelectedVariant)).toBe(0);
      expect(getProductTotalPrice(productWithSelectedVariant)).toBe(26);
    });
  });

  describe('Min price calculation', () => {
    it('price should be available for a basic product', () => {
      expect(isFullPriceAvailable(basicProductState)).toBe(true);
    });

    it('price should not be available for a product with unselected options', () => {
      expect(isFullPriceAvailable(productWithOneOption)).toBe(false);
    });

    it('price should be available for a product with selected options', () => {
      expect(isFullPriceAvailable(productWithSelectedOptions)).toBe(true);
    });

    it('price should not be available for a product with unselected variants', () => {
      expect(isFullPriceAvailable(productWithVariants)).toBe(false);
    });

    it('price should be available for a product with selected variants', () => {
      expect(isFullPriceAvailable(productWithSelectedVariant)).toBe(true);
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
    const store = createStore(
      combineReducers({ product: reducers }),
      productWithVariantsAndOptions
    );

    it('Step 1: Opening the product', () => {
      const state = store.getState();

      // No additional price can be calculated at the moment.
      expect(getProductPriceAddition(state)).toBe(0);
      expect(getProductTotalPrice(state)).toBe(10.51);
      expect(isFullPriceAvailable(state)).toBe(false);

      // No product options can be found since they are on the variant only.
      expect(getRawProductOptions(state)).toBeFalsy();
    });

    it('Step 2: Select a children/variant', () => {
      store.dispatch(setProductVariantId('SG76'));
      const state = store.getState();

      // Additional price can still not be calculated because options are now available.
      expect(getProductPriceAddition(state)).toBe(0);
      expect(getProductTotalPrice(state)).toBe(10.52);
      expect(isFullPriceAvailable(state)).toBe(false);

      // Product options are now available.
      expect(getRawProductOptions(state).length).toBe(1);

      // Peak into the calculated relative additional prices.
      const availableOptions = getProductOptions(state);
      expect(availableOptions[0].items[0].price).toBe(5);
      expect(availableOptions[0].items[1].price).toBe(4);
    });

    it('Step 3: Select the option', () => {
      store.dispatch(setProductOption('1', '5'));
      const state = store.getState();

      // Additional price can now be calculated.
      expect(getProductPriceAddition(state)).toBe(5);
      expect(getProductTotalPrice(state)).toBe(15.52);

      // Peak into the calculated relative additional prices.
      const availableOptions = getProductOptions(state);
      expect(availableOptions[0].items[0].price).toBe(0);
      expect(availableOptions[0].items[1].price).toBe(-1);
      expect(isFullPriceAvailable(state)).toBe(true);
    });

    it('Step 4: Change to a different variant', () => {
      store.dispatch(setProductVariantId('SG78'));
      const state = store.getState();

      // Additional price should still be calculated
      expect(getProductPriceAddition(state)).toBe(5);
      expect(getProductTotalPrice(state)).toBe(15.54);
      expect(isFullPriceAvailable(state)).toBe(true);

      // Product options are still available.
      expect(getRawProductOptions(state).length).toBe(1);
    });

    it('Step 5: Change to a different option', () => {
      store.dispatch(setProductOption('1', '3'));
      const state = store.getState();

      // Additional price has changed.
      expect(getProductPriceAddition(state)).toBe(3);
      expect(getProductTotalPrice(state)).toBe(13.54);
      expect(isFullPriceAvailable(state)).toBe(true);
    });
  });
});
