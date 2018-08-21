import upperFirst from 'lodash/upperFirst';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  PROPERTIES_FILTER_BLACKLIST,
  PROPERTIES_FILTER_WHITELIST,
} from '../constants/';
import {
  mockedProductState,
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
  getProduct,
  getProductName,
  getProductRating,
  getProductManufacturer,
  getProductStock,
  getProductAvailability,
  getProductFlags,
  getProductMetadata,
  getProductPrice,
  getProductCurrency,
  getProductUnitPrice,
  getProductShipping,
  getProductDescription,
  getProductProperties,
  getProductImages,
  getProductVariants,
  isOrderable,
  hasVariants,
  isBaseProduct,
  getBaseProductId,
  getBaseProduct,
  getVariantId,
  getVariantAvailabilityByCharacteristics,
  isProductOrderable,
} from './product';

jest.mock('@shopgate/pwa-core/helpers', () => {
  const original = require.requireActual('@shopgate/pwa-core/helpers');

  return {
    ...original,
    logger: {
      warn: jest.fn(),
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
  let mockedMainState;

  beforeEach(() => {
    // Create a deep copy of the state to avoid unintended selector caching.
    mockedMainState = JSON.parse(JSON.stringify(mockedProductState));
    mockedConfig = null;
    jest.clearAllMocks();
  });

  describe('getProductState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductState({})).toEqual({});
    });

    it('should work as expected', () => {
      const { product } = mockedMainState;
      expect(getProductState(mockedMainState)).toEqual(product);
    });
  });

  describe('getProducts()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProducts({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProducts(mockedMainState)).toEqual(mockedProductsById);
    });
  });

  describe('getProductShippingState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductShippingState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductShippingState(mockedMainState)).toEqual(mockedShippingByProductId);
    });
  });

  describe('getProductDescriptionState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductDescriptionState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductDescriptionState(mockedMainState)).toEqual(mockedDescriptionsByProductId);
    });
  });

  describe('getProductPropertiesState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductPropertiesState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductPropertiesState(mockedMainState)).toEqual(mockedPropertiesByProductId);
    });
  });

  describe('getProductImagesState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductImagesState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductImagesState(mockedMainState)).toEqual(mockedImagesByProductId);
    });
  });

  describe('getProductVariantsState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductVariantsState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductVariantsState(mockedMainState)).toEqual(mockedVariantsByProductId);
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
      expect(getProductById(mockedMainState, { productId })).toEqual(product);
    });

    it('should return a product when a product id was passed in the deprecated way', () => {
      expect(getProductById(mockedMainState, productId)).toEqual(product);
      expect(logger.warn).toHaveBeenCalledTimes(1);
    });

    it('should null when no props objects was passed', () => {
      expect(getProductById(mockedMainState)).toBeNull();
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

  describe('getProduct()', () => {
    it('should return null when the product is not selectable yet', () => {
      const productId = 'product_5';
      expect(getProduct({}, { productId })).toBeNull();
    });

    it('should return null when the product data is not available yet', () => {
      const productId = 'product_4';
      expect(getProduct(mockedMainState, { productId })).toBeNull();
    });

    it('should return product data of a simple product', () => {
      const productId = 'product_5';
      const { productData } = mockedProductsById[productId];
      expect(getProduct(mockedMainState, { productId })).toEqual(productData);
    });

    it('should return product data of a variant product', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { productData } = mockedProductsById[variantId];
      expect(getProduct(mockedMainState, { productId, variantId })).toEqual(productData);
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
      [getProductPrice, 'price'],
      [getProductMetadata, 'metadata'],
    ];

    tests.forEach((test) => {
      const [selector, property] = test;

      describe(`getProduct${upperFirst(property)}()`, () => {
        it('should return null when the product is not available', () => {
          expect(selector({}, { productId })).toBeNull();
        });

        it('should return the property as expected', () => {
          expect(selector(mockedMainState, { productId })).toEqual(productData[property]);
        });
      });
    });

    describe('getProductCurrency()', () => {
      it('should return null when the product is not available', () => {
        expect(getProductCurrency({}, { productId })).toBeNull();
      });

      it('should return the property as expected', () => {
        expect(getProductCurrency(mockedMainState, { productId }))
          .toBe(productData.price.currency);
      });
    });

    describe('getProductUnitPrice()', () => {
      it('should return null when the product is not available', () => {
        expect(getProductUnitPrice({}, { productId })).toBeNull();
      });

      it('should return the property as expected', () => {
        expect(getProductUnitPrice(mockedMainState, { productId }))
          .toBe(productData.price.unitPrice);
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
      expect(getProductShipping(mockedMainState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_5';
      expect(getProductShipping(mockedMainState, { productId })).toBeNull();
    });

    it('should return data when available', () => {
      const productId = 'product_1';
      const { shipping } = mockedShippingByProductId[productId];
      expect(getProductShipping(mockedMainState, { productId })).toEqual(shipping);
    });
  });

  describe('getProductProperties()', () => {
    it('should return null when no data can be selected for the passed productId', () => {
      const productId = 'unavailable';
      expect(getProductProperties({}, { productId })).toBeNull();
    });

    it('should return null when a product is present but no data is available yet', () => {
      const productId = 'product_4';
      expect(getProductProperties(mockedMainState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_5';
      expect(getProductProperties(mockedMainState, { productId })).toBeNull();
    });

    it('should return data when available', () => {
      const productId = 'product_1';
      const { properties } = mockedPropertiesByProductId[productId];
      expect(getProductProperties(mockedMainState, { productId })).toEqual(properties);
    });

    describe('Black and whitelisting of properties', () => {
      const selectorProps = { productId: 'product_1' };

      it('should get whitelisted properties', () => {
        mockedConfig = {
          type: PROPERTIES_FILTER_WHITELIST,
          properties: [mockedProperty1.label],
        };

        const properties = getProductProperties(mockedMainState, selectorProps);
        expect(properties.length).toEqual(1);
        expect(properties[0].label).toEqual(mockedProperty1.label);
        expect(properties[0].label).not.toEqual(mockedProperty2.label);
      });

      it('should not get blacklisted properties', () => {
        mockedConfig = {
          type: PROPERTIES_FILTER_BLACKLIST,
          properties: [mockedProperty1.label],
        };

        const properties = getProductProperties(mockedMainState, selectorProps);
        expect(properties.length).toEqual(1);
        expect(properties[0].label).not.toEqual(mockedProperty1.label);
        expect(properties[0].label).toEqual(mockedProperty2.label);
      });

      it('should not filter with invalid type', () => {
        mockedConfig = {
          type: 'foo',
          properties: [mockedProperty1.label],
        };

        const properties = getProductProperties(mockedMainState, selectorProps);
        expect(properties.length).toEqual(2);
        expect(properties).toEqual([
          mockedProperty1,
          mockedProperty2,
        ]);
      });

      it('should not filter when no config is set', () => {
        mockedConfig = null;

        const properties = getProductProperties(mockedMainState, selectorProps);
        expect(properties.length).toEqual(2);
        expect(properties).toEqual([
          mockedProperty1,
          mockedProperty2,
        ]);
      });

      it('should filter all when whitelist is empty array', () => {
        mockedConfig = {
          type: PROPERTIES_FILTER_WHITELIST,
          properties: [],
        };

        const properties = getProductProperties(mockedMainState, selectorProps);
        expect(properties.length).toEqual(0);
      });

      it('should pass all when blacklist is empty array', () => {
        mockedConfig = {
          type: PROPERTIES_FILTER_BLACKLIST,
          properties: [],
        };

        const properties = getProductProperties(mockedMainState, selectorProps);
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
      expect(getProductDescription(mockedMainState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_5';
      expect(getProductDescription(mockedMainState, { productId })).toBeNull();
    });

    it('should return data when available', () => {
      const productId = 'product_1';
      const { description } = mockedDescriptionsByProductId[productId];
      expect(getProductDescription(mockedMainState, { productId })).toEqual(description);
    });
  });

  describe('getProductImages()', () => {
    it('should return null when no data can be selected for the passed productId', () => {
      const productId = 'unavailable';
      expect(getProductImages({}, { productId })).toBeNull();
    });

    it('should return null when a product is present but no data is available yet', () => {
      const productId = 'product_4';
      expect(getProductImages(mockedMainState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_5';
      expect(getProductImages(mockedMainState, { productId })).toBeNull();
    });

    it('should return images when available', () => {
      const productId = 'product_1';
      expect(getProductImages(mockedMainState, { productId })).toEqual(mockedProductImagesBase);
    });

    it('should return images for a variant when productId and variantId are passed', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      expect(getProductImages(mockedMainState, { productId, variantId }))
        .toEqual(mockedProductImagesVariant);
    });

    it('should return images for a variant when only the variantId is passed', () => {
      const variantId = 'product_2';
      expect(getProductImages(mockedMainState, { variantId })).toEqual(mockedProductImagesVariant);
    });

    it('should return images for a variant when the id of a variant is passed as a productId', () => {
      const productId = 'product_2';
      expect(getProductImages(mockedMainState, { productId })).toEqual(mockedProductImagesVariant);
    });

    it('should return images of the base product when a variant has no images', () => {
      const productId = 'product_1';
      const variantId = 'product_3';
      expect(getProductImages(mockedMainState, { productId, variantId }))
        .toEqual(mockedProductImagesBase);
    });

    it('should return images of the base product when a variant has no images and only the variantId is passed', () => {
      const variantId = 'product_3';
      expect(getProductImages(mockedMainState, { variantId })).toEqual(mockedProductImagesBase);
    });

    it('should return images of the base product when the id of a variant is passed as a productId', () => {
      const productId = 'product_3';
      expect(getProductImages(mockedMainState, { productId })).toEqual(mockedProductImagesBase);
    });
  });

  describe('getProductVariants()', () => {
    it('should return null when no data can be selected for the passed productId', () => {
      const productId = 'unavailable';
      expect(getProductVariants({}, { productId })).toBeNull();
    });

    it('should return null when a product is present but no data is available yet', () => {
      const productId = 'product_1';

      delete mockedMainState.product.variantsByProductId[productId];

      expect(getProductVariants(mockedMainState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_1';

      const state = mockedMainState.product.variantsByProductId[productId];
      state.isFetching = true;
      state.variants = undefined;

      expect(getProductVariants(mockedMainState, { productId })).toBeNull();
    });

    it('should return data when the productId of a base product is passed', () => {
      const productId = 'product_1';
      const { variants } = mockedVariantsByProductId[productId];
      expect(getProductVariants(mockedMainState, { productId })).toEqual(variants);
    });

    it('should return data when the productId of a base product and a variantId is passed', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { variants } = mockedVariantsByProductId[productId];
      expect(getProductVariants(mockedMainState, { productId, variantId })).toEqual(variants);
    });

    it('should return data when only the id of a variant is passed', () => {
      const productId = 'product_2';
      const { variants } = mockedVariantsByProductId.product_1;
      expect(getProductVariants(mockedMainState, { productId })).toEqual(variants);
    });
  });

  describe('isOrderable()', () => {
    it('should return false when the product is not available', () => {
      const productId = 'unavailable';
      expect(isOrderable(mockedMainState, { productId })).toBe(false);
    });

    it('should return false when the product does not have stock info', () => {
      const productId = 'product_4';
      expect(isOrderable(mockedMainState, { productId })).toBe(false);
    });

    it('should return false when the product is not orderable', () => {
      const productId = 'product_3';
      expect(isOrderable(mockedMainState, { productId })).toBe(false);
    });

    it('should return true when the product is orderable', () => {
      const productId = 'product_5';
      expect(isOrderable(mockedMainState, { productId })).toBe(true);
    });
  });

  describe('hasVariants()', () => {
    it('should return false when the product is not available', () => {
      const productId = 'unavailable';
      expect(hasVariants(mockedMainState, { productId })).toBe(false);
    });

    it('should return false when the product does not have variants', () => {
      const productId = 'product_5';
      expect(hasVariants(mockedMainState, { productId })).toBe(false);
    });

    it('should return true when the product has variants', () => {
      const productId = 'product_1';
      expect(hasVariants(mockedMainState, { productId })).toBe(true);
    });
  });

  describe('isBaseProduct()', () => {
    it('should indicate base products', () => {
      expect(isBaseProduct(mockedMainState, { productId: 'product_1' })).toBe(true);
      expect(isBaseProduct(mockedMainState, { productId: 'product_2' })).toBe(false);
      expect(isBaseProduct(mockedMainState, { productId: 'product_4' })).toBe(false);
      expect(isBaseProduct(mockedMainState, { productId: 'product_5' })).toBe(true);
    });
  });

  describe('getBaseProductId()', () => {
    it('should return null when the product is not available', () => {
      const productId = 'unavailable';
      expect(getBaseProductId(mockedMainState, { productId })).toBeNull();
    });

    it('should return the id of a base product when no variant is selected yet', () => {
      const productId = 'product_1';
      expect(getBaseProductId(mockedMainState, { productId })).toBe(productId);
    });

    it('should return the id of a simple product', () => {
      const productId = 'product_5';
      expect(getBaseProductId(mockedMainState, { productId })).toBe(productId);
    });

    it('should return the id of a base product when a variant is selected ', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      expect(getBaseProductId(mockedMainState, { productId, variantId })).toBe(productId);
    });
  });

  describe('getBaseProduct()', () => {
    it('should return null when the product is not available', () => {
      const productId = 'unavailable';
      expect(getBaseProduct(mockedMainState, { productId })).toBeNull();
    });

    it('should return null when the base product is not available', () => {
      const productId = 'product_2';
      delete mockedMainState.product.productsById.product_1;
      expect(getBaseProduct(mockedMainState, { productId })).toBeNull();
    });

    it('should return the the base product when no variant is selected yet', () => {
      const productId = 'product_1';
      const { productData } = mockedProductsById[productId];
      expect(getBaseProduct(mockedMainState, { productId })).toEqual(productData);
    });

    it('should return the the base product when a variant is selected', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { productData } = mockedProductsById[productId];
      expect(getBaseProduct(mockedMainState, { productId, variantId }))
        .toEqual(productData);
    });

    it('should return the the base product when only a variant is selected', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { productData } = mockedProductsById[productId];
      expect(getBaseProduct(mockedMainState, { variantId })).toEqual(productData);
    });
  });

  describe('getVariantId()', () => {
    it('should return null when the product is not available', () => {
      const productId = 'unavailable';
      expect(getVariantId(mockedMainState, { productId })).toBeNull();
    });

    it('should return null when the product is a simple product', () => {
      const productId = 'product_5';
      expect(getVariantId(mockedMainState, { productId })).toBeNull();
    });

    it('should return null when the product is a base product', () => {
      const productId = 'product_1';
      expect(getVariantId(mockedMainState, { productId })).toBeNull();
    });

    it('should return a productId when the product is a variant product', () => {
      const productId = 'product_2';
      expect(getVariantId(mockedMainState, { productId })).toBe(productId);
    });

    it('should return the productId of the variant if base product and variant are selected', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      expect(getVariantId(mockedMainState, { productId, variantId })).toBe(variantId);
    });
  });

  describe('getVariantAvailabilityByCharacteristics()', () => {
    it('should return null when no props where passed', () => {
      expect(getVariantAvailabilityByCharacteristics(mockedMainState)).toBeNull();
    });

    it('should return null when no variants are available yet', () => {
      const productId = 'unavailable';
      const characteristics = {};
      const props = { productId, characteristics };
      expect(getVariantAvailabilityByCharacteristics(mockedMainState, props)).toBeNull();
    });

    it('should return null when no matching product was found', () => {
      const productId = 'product_1';
      const characteristics = { 1: '5' };
      const props = { productId, characteristics };
      expect(getVariantAvailabilityByCharacteristics(mockedMainState, props)).toBeNull();
    });

    it('should return data when a matching product was found', () => {
      const productId = 'product_1';
      const {
        characteristics,
        availability,
      } = mockedVariantsByProductId[productId].variants.products[1];

      const props = { productId, characteristics };
      expect(getVariantAvailabilityByCharacteristics(mockedMainState, props)).toEqual(availability);
    });
  });

  describe('isProductOrderable()', () => {
    it('should return false when the product is not available', () => {
      const productId = 'unavailable';
      expect(isProductOrderable(mockedMainState, { productId })).toBe(false);
    });

    it('should return false when the product is currently fetching', () => {
      const productId = 'product_4';
      expect(isProductOrderable(mockedMainState, { productId })).toBe(false);
    });

    it('should return false when the product is a base product', () => {
      const productId = 'product_1';
      expect(isProductOrderable(mockedMainState, { productId })).toBe(false);
    });

    it('should return false when the product is a not orderable variant', () => {
      const productId = 'product_3';
      expect(isProductOrderable(mockedMainState, { productId })).toBe(false);
    });

    it('should return true when the product is an orderable variant', () => {
      const productId = 'product_2';
      expect(isProductOrderable(mockedMainState, { productId })).toBe(true);
    });
  });
});
