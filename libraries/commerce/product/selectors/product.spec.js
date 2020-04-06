/* eslint-disable extra-rules/no-single-line-objects */
import upperFirst from 'lodash/upperFirst';
import { logger } from '@shopgate/pwa-core/helpers';
import { PROPERTIES_FILTER_BLACKLIST, PROPERTIES_FILTER_WHITELIST } from '../constants';

import {
  mockedState as mockedProductState,
  mockedProductMetadata,
  mockedProductsById,
  mockedShippingByProductId,
  mockedDescriptionsByProductId,
  mockedPropertiesByProductId,
  mockedProperty1,
  mockedProperty2,
  mockedImagesByProductId,
  mockedProductImagesBase,
  mockedProductImagesVariant,
  mockedVariantsByProductId,
} from './product.mock';

import {
  getProductState,
  getProducts,
  getProductShippingState,
  getProductDescriptionState,
  getProductPropertiesState,
  getProductImagesState,
  getProductVariantsState,
  getProductById,
  getProductId,
  getVariantProductId,
  isVariantSelected,
  getProduct,
  getProductName,
  getProductLongName,
  getProductRating,
  getProductManufacturer,
  getProductStock,
  getProductAvailability,
  getProductFlags,
  getProductMetadata,
  getBaseProductMetadata,
  getProductPriceData,
  getProductCurrency,
  getProductUnitPrice,
  getProductShipping,
  getProductDescription,
  getProductProperties,
  getProductImages,
  getProductVariants,
  isProductOrderable,
  hasProductVariants,
  getSelectedVariant,
  isBaseProduct,
  getBaseProductId,
  getBaseProduct,
  hasBaseProductVariants,
  getVariantId,
  getVariantAvailabilityByCharacteristics,
  hasProductVariety,
} from './product';

jest.mock('@shopgate/pwa-core/helpers', () => {
  const original = require.requireActual('@shopgate/pwa-core/helpers');

  return {
    ...original,
    logger: {
      warn: jest.fn(),
      error: jest.fn(),
    },
  };
});

let mockedConfig;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get productPropertiesFilter() {
    return mockedConfig;
  },
}));

describe('Product selectors', () => {
  let mockedState;

  beforeEach(() => {
    // Create a deep copy of the state to avoid unintended selector caching.
    mockedState = JSON.parse(JSON.stringify(mockedProductState));
    mockedConfig = null;
    jest.clearAllMocks();
  });

  describe('getProductState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductState({})).toEqual({});
    });

    it('should work as expected', () => {
      const { product } = mockedState;
      expect(getProductState(mockedState)).toEqual(product);
    });
  });

  describe('getProducts()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProducts({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProducts(mockedState)).toEqual(mockedProductsById);
    });
  });

  describe('getProductShippingState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductShippingState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductShippingState(mockedState)).toEqual(mockedShippingByProductId);
    });
  });

  describe('getProductDescriptionState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductDescriptionState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductDescriptionState(mockedState)).toEqual(mockedDescriptionsByProductId);
    });
  });

  describe('getProductPropertiesState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductPropertiesState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductPropertiesState(mockedState)).toEqual(mockedPropertiesByProductId);
    });
  });

  describe('getProductImagesState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductImagesState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductImagesState(mockedState)).toEqual(mockedImagesByProductId);
    });
  });

  describe('getProductVariantsState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductVariantsState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductVariantsState(mockedState)).toEqual(mockedVariantsByProductId);
    });
  });

  describe('getProductById()', () => {
    const productId = 'product_5';
    const product = mockedProductsById[productId];

    it('should return null when empty props are passed', () => {
      expect(getProductById({}, {})).toBeNull();
    });

    it('should return null when no products are selectable yet', () => {
      expect(getProductById({}, { productId })).toBeNull();
    });

    it('should return null when the expected product is not available', () => {
      expect(getProductById({}, { productId: 'unavailable' })).toBeNull();
    });

    it('should return a product', () => {
      expect(getProductById(mockedState, { productId })).toEqual(product);
    });

    it('should return a product when a product id was passed in the deprecated way', () => {
      expect(getProductById(mockedState, productId)).toEqual(product);
      expect(logger.warn).toHaveBeenCalledTimes(1);
    });

    it('should null when no props objects was passed', () => {
      expect(getProductById(mockedState)).toBeNull();
      expect(logger.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductId()', () => {
    it('should return null when no props are passed', () => {
      expect(getProductId()).toBeNull();
    });

    it('should return null when no productId was passed within the props', () => {
      expect(getProductId({}, {})).toBeNull();
    });

    it('should return a productId', () => {
      const productId = 'product_id';
      expect(getProductId({}, { productId })).toBe(productId);
    });

    it('should return a variantId', () => {
      const productId = 'product_id';
      const variantId = 'variant_id';
      expect(getProductId({}, { productId, variantId })).toBe(variantId);
    });

    it('should return a productId when a passed variantId is undefined', () => {
      const productId = 'product_id';
      let variantId;
      expect(getProductId({}, { productId, variantId })).toBe(productId);
    });

    it('should return a productId when a passed variantId is null', () => {
      const productId = 'product_id';
      const variantId = null;
      expect(getProductId({}, { productId, variantId })).toBe(productId);
    });
  });

  describe('getVariantProductId()', () => {
    it('should return null and log a message when no props are passed', () => {
      expect(getVariantProductId(mockedState)).toBeNull();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it('should return null when the props dont contain a variantId', () => {
      expect(getVariantProductId(mockedState, { productId: 'product_1' })).toBeNull();
    });

    it('should return the expected variant id', () => {
      const variantId = 'product_2';
      expect(getVariantProductId(mockedState, { variantId })).toBe(variantId);
    });
  });

  describe('isVariantSelected()', () => {
    it('should return false when no variantId was passed', () => {
      expect(isVariantSelected({}, { productId: 'product_1' })).toBe(false);
    });

    it('should return true when a variantId was passed', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      expect(isVariantSelected(mockedState, { productId, variantId })).toBe(true);
    });
  });

  describe('getProduct()', () => {
    it('should return null and log an error when no props are passed', () => {
      expect(getProduct(mockedState)).toBeNull();
    });

    it('should return null when the product is not selectable yet', () => {
      const productId = 'product_5';
      expect(getProduct({}, { productId })).toBeNull();
    });

    it('should return null when the product data is not available yet', () => {
      const productId = 'product_4';
      expect(getProduct(mockedState, { productId })).toBeNull();
    });

    it('should return product data of a simple product', () => {
      const productId = 'product_5';
      const { productData } = mockedProductsById[productId];
      expect(getProduct(mockedState, { productId })).toEqual(productData);
    });

    it('should return product data of a variant product', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { productData } = mockedProductsById[variantId];
      expect(getProduct(mockedState, { productId, variantId })).toEqual(productData);
    });
  });

  describe('Product property selectors', () => {
    const productId = 'product_5';
    const { productData } = mockedProductsById[productId];

    const tests = [
      [getProductName, 'name'],
      [getProductRating, 'rating'],
      [getProductManufacturer, 'manufacturer'],
      [getProductStock, 'stock'],
      [getProductAvailability, 'availability'],
      [getProductFlags, 'flags'],
      [getProductPriceData, 'price'],
      [getProductMetadata, 'metadata'],
    ];

    tests.forEach((test) => {
      const [selector, property] = test;

      describe(`getProduct${upperFirst(property)}()`, () => {
        it('should return null when the product is not available', () => {
          expect(selector({}, { productId })).toBeNull();
        });

        it('should return the property as expected', () => {
          expect(selector(mockedState, { productId })).toEqual(productData[property]);
        });
      });
    });

    describe('getProductLongName()', () => {
      it('should return the property as expected', () => {
        const id = 'product_5';
        const mockProductData = mockedProductsById[id].productData;
        expect(getProductLongName(mockedState, { productId: id }))
          .toEqual(mockProductData.longName);
      });

      it('should return the short name if long is not available', () => {
        const id = 'product_7';
        const mockProductData = mockedProductsById[id].productData;
        expect(getProductLongName(mockedState, { productId: id })).toEqual(mockProductData.name);
      });

      it('should return null if no data is available', () => {
        expect(getProductLongName(mockedState, { productId: 'product_4' })).toEqual(null);
      });
    });

    describe('getBaseProductMetadata()', () => {
      it('should return null when the product is not available', () => {
        expect(getBaseProductMetadata({}, { productId })).toBeNull();
      });

      it('should return the property as expected', () => {
        expect(getBaseProductMetadata(mockedState, { productId: 'product_2' })).toEqual(mockedProductMetadata);
      });
    });

    describe('getProductCurrency()', () => {
      it('should return null when the product is not available', () => {
        expect(getProductCurrency({}, { productId })).toBeNull();
      });

      it('should return the property as expected', () => {
        expect(getProductCurrency(mockedState, { productId })).toBe(productData.price.currency);
      });
    });

    describe('getProductUnitPrice()', () => {
      it('should return null when the product is not available', () => {
        expect(getProductUnitPrice({}, { productId })).toBeNull();
      });

      it('should return the property as expected', () => {
        expect(getProductUnitPrice(mockedState, { productId })).toBe(productData.price.unitPrice);
      });
    });
  });

  describe('getProductShipping()', () => {
    it('should return null when no data can be selected for the passed productId', () => {
      const productId = 'unavailable';
      expect(getProductShipping({}, { productId })).toBeNull();
    });

    it('should return null when a product is present but no data is available yet', () => {
      const productId = 'product_4';
      expect(getProductShipping(mockedState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_5';
      expect(getProductShipping(mockedState, { productId })).toBeNull();
    });

    it('should return data when available', () => {
      const productId = 'product_1';
      const { shipping } = mockedShippingByProductId[productId];
      expect(getProductShipping(mockedState, { productId })).toEqual(shipping);
    });
  });

  describe('getProductProperties()', () => {
    it('should return null when no data can be selected for the passed productId', () => {
      const productId = 'unavailable';
      expect(getProductProperties({}, { productId })).toBeNull();
    });

    it('should return null when a product is present but no data is available yet', () => {
      const productId = 'product_4';
      expect(getProductProperties(mockedState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_5';
      expect(getProductProperties(mockedState, { productId })).toBeNull();
    });

    it('should return data when available', () => {
      const productId = 'product_1';
      const { properties } = mockedPropertiesByProductId[productId];
      expect(getProductProperties(mockedState, { productId })).toEqual(properties);
    });

    describe('Black and whitelisting of properties', () => {
      const selectorProps = { productId: 'product_1' };

      it('should get whitelisted properties', () => {
        mockedConfig = {
          type: PROPERTIES_FILTER_WHITELIST,
          properties: [mockedProperty1.label],
        };

        const properties = getProductProperties(mockedState, selectorProps);
        expect(properties.length).toEqual(1);
        expect(properties[0].label).toEqual(mockedProperty1.label);
        expect(properties[0].label).not.toEqual(mockedProperty2.label);
      });

      it('should not get blacklisted properties', () => {
        mockedConfig = {
          type: PROPERTIES_FILTER_BLACKLIST,
          properties: [mockedProperty1.label],
        };

        const properties = getProductProperties(mockedState, selectorProps);
        expect(properties.length).toEqual(1);
        expect(properties[0].label).not.toEqual(mockedProperty1.label);
        expect(properties[0].label).toEqual(mockedProperty2.label);
      });

      it('should not filter with invalid type', () => {
        mockedConfig = {
          type: 'foo',
          properties: [mockedProperty1.label],
        };

        const properties = getProductProperties(mockedState, selectorProps);
        expect(properties.length).toEqual(2);
        expect(properties).toEqual([mockedProperty1, mockedProperty2]);
      });

      it('should not filter when no config is set', () => {
        mockedConfig = null;

        const properties = getProductProperties(mockedState, selectorProps);
        expect(properties.length).toEqual(2);
        expect(properties).toEqual([mockedProperty1, mockedProperty2]);
      });

      it('should filter all when whitelist is empty array', () => {
        mockedConfig = {
          type: PROPERTIES_FILTER_WHITELIST,
          properties: [],
        };

        const properties = getProductProperties(mockedState, selectorProps);
        expect(properties.length).toEqual(0);
      });

      it('should pass all when blacklist is empty array', () => {
        mockedConfig = {
          type: PROPERTIES_FILTER_BLACKLIST,
          properties: [],
        };

        const properties = getProductProperties(mockedState, selectorProps);
        expect(properties.length).toEqual(2);
      });
    });
  });

  describe('getProductDescription()', () => {
    it('should return null when no data can be selected for the passed productId', () => {
      const productId = 'unavailable';
      expect(getProductDescription({}, { productId })).toBeNull();
    });

    it('should return null when a product is present but no data is available yet', () => {
      const productId = 'product_4';
      expect(getProductDescription(mockedState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_5';
      expect(getProductDescription(mockedState, { productId })).toBeNull();
    });

    it('should return data when available', () => {
      const productId = 'product_1';
      const { description } = mockedDescriptionsByProductId[productId];
      expect(getProductDescription(mockedState, { productId })).toEqual(description);
    });
  });

  describe('getProductImages()', () => {
    it('should return null when no data can be selected for the passed productId', () => {
      const productId = 'unavailable';
      expect(getProductImages({}, { productId })).toBeNull();
    });

    it('should return null when a product is present but no data is available yet', () => {
      const productId = 'product_4';
      expect(getProductImages(mockedState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_5';
      expect(getProductImages(mockedState, { productId })).toBeNull();
    });

    it('should return an empty array when a product does not have images', () => {
      const productId = 'product_1';
      mockedState.product.imagesByProductId[productId].images = [];
      expect(getProductImages(mockedState, { productId })).toEqual([]);
    });

    it('should return null when no props are passed', () => {
      expect(getProductImages({})).toBeNull();
    });

    it('should return images when available', () => {
      const productId = 'product_1';
      expect(getProductImages(mockedState, { productId }))
        .toEqual(mockedProductImagesBase);
    });

    it('should return images for a variant when productId and variantId are passed', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      expect(getProductImages(mockedState, { productId, variantId }))
        .toEqual(mockedProductImagesVariant);
    });

    it('should return images for a variant when only the variantId is passed', () => {
      const variantId = 'product_2';
      expect(getProductImages(mockedState, { variantId }))
        .toEqual(mockedProductImagesVariant);
    });

    it('should return images for a variant when the id of a variant is passed as a productId', () => {
      const productId = 'product_2';
      expect(getProductImages(mockedState, { productId }))
        .toEqual(mockedProductImagesVariant);
    });

    it('should return images of the base product when a variant has no images', () => {
      const productId = 'product_1';
      const variantId = 'product_3';
      mockedState.product.imagesByProductId[variantId].images = [];
      expect(getProductImages(mockedState, { productId, variantId }))
        .toEqual(mockedProductImagesBase);
    });

    it('should return images of the base product when a variant has no images and only the variantId is passed', () => {
      const variantId = 'product_3';
      mockedState.product.imagesByProductId[variantId].images = [];
      expect(getProductImages(mockedState, { variantId }))
        .toEqual(mockedProductImagesBase);
    });

    it('should return images of the base product when the id of a variant is passed as a productId', () => {
      const productId = 'product_3';
      expect(getProductImages(mockedState, { productId }))
        .toEqual(mockedProductImagesBase);
    });
  });

  describe('getProductVariants()', () => {
    it('should return null when no data can be selected for the passed productId', () => {
      const productId = 'unavailable';
      expect(getProductVariants(mockedState, { productId })).toBeNull();
    });

    it('should return null when a product is present but no data is available yet', () => {
      const productId = 'product_1';

      delete mockedState.product.variantsByProductId[productId];

      expect(getProductVariants(mockedState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_1';

      const state = mockedState.product.variantsByProductId[productId];
      state.isFetching = true;
      state.variants = undefined;

      expect(getProductVariants(mockedState, { productId })).toBeNull();
    });

    it('should return data when the productId of a base product is passed', () => {
      const productId = 'product_1';
      const { variants } = mockedVariantsByProductId[productId];
      expect(getProductVariants(mockedState, { productId })).toEqual(variants);
    });

    it('should return data when the productId of a base product and a variantId is passed', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { variants } = mockedVariantsByProductId[productId];
      expect(getProductVariants(mockedState, { productId, variantId })).toEqual(variants);
    });

    it('should return data when only the id of a variant is passed', () => {
      const productId = 'product_2';
      const { variants } = mockedVariantsByProductId.product_1;
      expect(getProductVariants(mockedState, { productId })).toEqual(variants);
    });
  });

  describe('isProductOrderable()', () => {
    it('should return false when the product is not available', () => {
      const productId = 'unavailable';
      expect(isProductOrderable(mockedState, { productId })).toBe(false);
    });

    it('should return false when the product does not have stock info', () => {
      const productId = 'product_4';
      expect(isProductOrderable(mockedState, { productId })).toBe(false);
    });

    it('should return false when the product is not orderable', () => {
      const productId = 'product_3';
      expect(isProductOrderable(mockedState, { productId })).toBe(false);
    });

    it('should return true when the product is orderable', () => {
      const productId = 'product_5';
      expect(isProductOrderable(mockedState, { productId })).toBe(true);
    });
  });

  describe('hasProductVariants()', () => {
    it('should return false when the product is not available', () => {
      const productId = 'unavailable';
      expect(hasProductVariants(mockedState, { productId })).toBe(false);
    });

    it('should return false when the product does not have variants', () => {
      const productId = 'product_5';
      expect(hasProductVariants(mockedState, { productId })).toBe(false);
    });

    it('should return true when the product has variants', () => {
      const productId = 'product_1';
      expect(hasProductVariants(mockedState, { productId })).toBe(true);
    });
  });

  describe('getSelectedVariant()', () => {
    it('should return null when no variant is selected', () => {
      const productId = 'product_1';
      expect(getSelectedVariant(mockedState, { productId })).toBeNull();
    });

    it('should return null when no variant is selected', () => {
      const productId = 'product_1';
      const variantId = 'unknown';
      expect(getSelectedVariant(mockedState, { productId, variantId })).toBeNull();
    });

    it('should return null for a fetching product', () => {
      const productId = 'product_1';
      const variantId = 'product_4';
      expect(getSelectedVariant(mockedState, { productId, variantId })).toBeNull();
    });

    it('should return a product', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { productData } = mockedProductsById[variantId];
      expect(getSelectedVariant(mockedState, { productId, variantId })).toEqual(productData);
    });
  });

  describe('isBaseProduct()', () => {
    it('should indicate base products', () => {
      expect(isBaseProduct(mockedState, { productId: 'product_1' })).toBe(true);
      expect(isBaseProduct(mockedState, { productId: 'product_2' })).toBe(false);
      expect(isBaseProduct(mockedState, { productId: 'product_4' })).toBe(false);
      expect(isBaseProduct(mockedState, { productId: 'product_5' })).toBe(true);
    });
  });

  describe('getBaseProductId()', () => {
    it('should return null when props are not given', () => {
      expect(getBaseProductId(mockedState)).toBeNull();
    });

    it('should return null when product is not found in store', () => {
      const productId = 'unknown';
      expect(getBaseProductId(mockedState, { productId })).toBeNull();
    });

    it('should return the id of a base product when baseProductId is null', () => {
      const productId = 'product_5';
      expect(getBaseProductId(mockedState, { productId })).toBe(productId);
    });

    it('should return the id of a simple product', () => {
      const productId = 'product_5';
      expect(getBaseProductId(mockedState, { productId })).toBe(productId);
    });

    it('should return the id of a base product when no variantId is in props', () => {
      const productId = 'product_1';
      expect(getBaseProductId(mockedState, { productId })).toBe(productId);
    });

    it('should return the id of a base product when a variantId is in props', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      expect(getBaseProductId(mockedState, { productId, variantId })).toBe(productId);
    });

    it('should return the id of a base product when a variantId is in props even if there is no variant product in the store', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      delete mockedState.product.variantsByProductId[variantId];
      expect(getBaseProductId(mockedState, { productId, variantId })).toBe(productId);
    });
  });

  describe('getBaseProduct()', () => {
    it('should return null and log an error when no props are passed', () => {
      expect(getBaseProduct(mockedState)).toBeNull();
    });

    it('should return null when the product is not available', () => {
      const productId = 'unavailable';
      expect(getBaseProduct(mockedState, { productId })).toBeNull();
    });

    it('should return null when the base product is not available', () => {
      const productId = 'product_2';
      delete mockedState.product.productsById.product_1;
      expect(getBaseProduct(mockedState, { productId })).toBeNull();
    });

    it('should return the the base product when no variant is selected yet', () => {
      const productId = 'product_1';
      const { productData } = mockedProductsById[productId];
      expect(getBaseProduct(mockedState, { productId })).toEqual(productData);
    });

    it('should return the the base product when a variant is selected', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { productData } = mockedProductsById[productId];
      expect(getBaseProduct(mockedState, { productId, variantId })).toEqual(productData);
    });

    it('should return the the base product when only a variant is selected', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { productData } = mockedProductsById[productId];
      expect(getBaseProduct(mockedState, { variantId })).toEqual(productData);
    });
  });

  describe('hasBaseProductVariants()', () => {
    it('should return false when the product is not available', () => {
      const productId = 'unavailable';
      expect(hasBaseProductVariants(mockedState, { productId })).toBe(false);
    });

    it('should return false when the base product is not available', () => {
      const productId = 'product_2';
      delete mockedState.product.productsById.product_1;
      expect(hasBaseProductVariants(mockedState, { productId })).toBe(false);
    });

    it('should return false when the flags are missing', () => {
      const productId = 'product_1';
      delete mockedState.product.productsById[productId].productData.flags;
      expect(hasBaseProductVariants(mockedState, { productId })).toBe(false);
    });

    it('should return false when no product data is available yet', () => {
      const productId = 'product_4';
      expect(hasBaseProductVariants(mockedState, { productId })).toBe(false);
    });

    it('should return false when the product does not have variants', () => {
      const productId = 'product_5';
      expect(hasBaseProductVariants(mockedState, { productId })).toBe(false);
    });

    it('should return true when the product has variants', () => {
      const productId = 'product_1';
      expect(hasBaseProductVariants(mockedState, { productId })).toBe(true);
    });

    it('should return true when the products base product has variants', () => {
      const productId = 'product_2';
      expect(hasBaseProductVariants(mockedState, { productId })).toBe(true);
    });
  });

  describe('getVariantId()', () => {
    it('should return null when the product is not available', () => {
      const productId = 'unavailable';
      expect(getVariantId(mockedState, { productId })).toBeNull();
    });

    it('should return null when the product is a simple product', () => {
      const productId = 'product_5';
      expect(getVariantId(mockedState, { productId })).toBeNull();
    });

    it('should return null when the product is a base product', () => {
      const productId = 'product_1';
      expect(getVariantId(mockedState, { productId })).toBeNull();
    });

    it('should return a productId when the product is a variant product', () => {
      const productId = 'product_2';
      expect(getVariantId(mockedState, { productId })).toBe(productId);
    });

    it('should return the productId of the variant if base product and variant are selected', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      expect(getVariantId(mockedState, { productId, variantId })).toBe(variantId);
    });
  });

  describe('getVariantAvailabilityByCharacteristics()', () => {
    it('should return null and log an error message when no props where passed', () => {
      expect(getVariantAvailabilityByCharacteristics(mockedState)).toBeNull();
    });

    it('should return null when no variants are available yet', () => {
      const productId = 'unavailable';
      const characteristics = {};
      const props = { productId, characteristics };
      expect(getVariantAvailabilityByCharacteristics(mockedState, props)).toBeNull();
    });

    it('should return null when no matching product was found', () => {
      const productId = 'product_1';
      const characteristics = { 1: '5' };
      const props = { productId, characteristics };
      expect(getVariantAvailabilityByCharacteristics(mockedState, props)).toBeNull();
    });

    it('should return data when a matching product was found', () => {
      const productId = 'product_1';
      const { characteristics, availability } = mockedVariantsByProductId[
        productId
      ].variants.products[1];

      const props = { productId, characteristics };
      expect(getVariantAvailabilityByCharacteristics(mockedState, props)).toEqual(availability);
    });
  });

  describe('hasProductVariety()', () => {
    it('should return null for missing product data', () => {
      expect(hasProductVariety(mockedState)).toBeNull();
      expect(hasProductVariety(mockedState, { productId: 'unknown' })).toBeNull();
    });

    it('should return false for simple product', () => {
      expect(hasProductVariety(mockedState, { productId: 'product_5' })).toBeFalsy();
    });
    it('should return true for variants', () => {
      expect(hasProductVariety(mockedState, { productId: 'product_1' })).toBeTruthy();
    });
    it('should return true for options', () => {
      mockedState.product.productsById.product_5.productData.flags.hasOptions = true;
      expect(hasProductVariety(mockedState, { productId: 'product_1' })).toBeTruthy();
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
