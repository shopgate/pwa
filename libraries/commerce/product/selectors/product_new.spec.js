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
} from './product_new.mock';
import {
  getProductState,
  getProducts,
  getProductShippingState,
  getProductDescriptionState,
  getProductPropertiesState,
  getProductById,
  getCurrentProductId,
  getCurrentProduct,
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
  isOrderable,
  hasVariants,
  isFetching,
  isBaseProduct,
  getBaseProductId,
  getCurrentBaseProduct,
  getVariantId,
  isProductOrderable,
} from './product_new';

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
  beforeEach(() => {
    jest.clearAllMocks();
    mockedConfig = null;
  });

  describe('getProductState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductState({})).toEqual({});
    });

    it('should work as expected', () => {
      const { product } = mockedProductState;
      expect(getProductState(mockedProductState)).toEqual(product);
    });
  });

  describe('getProducts()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProducts({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProducts(mockedProductState)).toEqual(mockedProductsById);
    });
  });

  describe('getProductShippingState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductShippingState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductShippingState(mockedProductState)).toEqual(mockedShippingByProductId);
    });
  });

  describe('getProductDescriptionState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductDescriptionState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductDescriptionState(mockedProductState)).toEqual(mockedDescriptionsByProductId);
    });
  });

  describe('getProductPropertiesState()', () => {
    it('should return an empty object if the state is not ready yet', () => {
      expect(getProductPropertiesState({})).toEqual({});
    });

    it('should work as expected', () => {
      expect(getProductPropertiesState(mockedProductState)).toEqual(mockedPropertiesByProductId);
    });
  });

  describe('getProductById()', () => {
    const productId = 'product_5';
    const product = mockedProductsById[productId];

    it('should return undefined when no products are selectable yet', () => {
      expect(getProductById({}, { productId })).toBeUndefined();
    });

    it('should return undefined when the expected product is not available', () => {
      expect(getProductById({}, { productId: 'unavailable' })).toBeUndefined();
    });

    it('should return a product', () => {
      expect(getProductById(mockedProductState, { productId })).toEqual(product);
    });

    it('should return a product when a product id was passed in the deprecated way', () => {
      expect(getProductById(mockedProductState, productId)).toEqual(product);
      expect(logger.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCurrentProductId()', () => {
    it('should return undefined when no props are passed', () => {
      expect(getCurrentProductId()).toBeUndefined();
    });

    it('should return undefined when no productId was passed within the props', () => {
      expect(getCurrentProductId({}, {})).toBeUndefined();
    });

    it('should return a productId', () => {
      const productId = 'product_id';
      expect(getCurrentProductId({}, { productId })).toBe(productId);
    });

    it('should return a variantId', () => {
      const productId = 'product_id';
      const variantId = 'variant_id';
      expect(getCurrentProductId({}, { productId, variantId })).toBe(variantId);
    });

    it('should return a productId when a passed variantId is undefined', () => {
      const productId = 'product_id';
      let variantId;
      expect(getCurrentProductId({}, { productId, variantId })).toBe(productId);
    });
  });

  describe('getCurrentProduct()', () => {
    it('should return undefined when the product is not selectable yet', () => {
      const productId = 'product_5';
      expect(getCurrentProduct({}, { productId })).toBeUndefined();
    });

    it('should return undefined when the product data is not available yet', () => {
      const productId = 'product_4';
      expect(getCurrentProduct(mockedProductState, { productId })).toBeUndefined();
    });

    it('should return product data of a simple product', () => {
      const productId = 'product_5';
      const { productData } = mockedProductsById[productId];
      expect(getCurrentProduct(mockedProductState, { productId })).toEqual(productData);
    });

    it('should return product data of a variant product', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { productData } = mockedProductsById[variantId];
      expect(getCurrentProduct(mockedProductState, { productId, variantId })).toEqual(productData);
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
          expect(selector(mockedProductState, { productId })).toBe(productData[property]);
        });
      });
    });

    describe('getProductCurrency()', () => {
      it('should return null when the product is not available', () => {
        expect(getProductCurrency({}, { productId })).toBeNull();
      });

      it('should return the property as expected', () => {
        expect(getProductCurrency(mockedProductState, { productId }))
          .toBe(productData.price.currency);
      });
    });

    describe('getProductUnitPrice()', () => {
      it('should return null when the product is not available', () => {
        expect(getProductUnitPrice({}, { productId })).toBeNull();
      });

      it('should return the property as expected', () => {
        expect(getProductUnitPrice(mockedProductState, { productId }))
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
      expect(getProductShipping(mockedProductState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_2';
      expect(getProductShipping(mockedProductState, { productId })).toBeNull();
    });

    it('should return data when available', () => {
      const productId = 'product_1';
      const { shipping } = mockedShippingByProductId[productId];
      expect(getProductShipping(mockedProductState, { productId })).toEqual(shipping);
    });
  });

  describe('getProductProperties()', () => {
    let mockedState;

    beforeEach(() => {
      mockedState = JSON.parse(JSON.stringify(mockedProductState));
    });

    it('should return null when no data can be selected for the passed productId', () => {
      const productId = 'unavailable';
      expect(getProductProperties({}, { productId })).toBeNull();
    });

    it('should return null when a product is present but no data is available yet', () => {
      const productId = 'product_4';
      expect(getProductProperties(mockedProductState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_2';
      expect(getProductProperties(mockedProductState, { productId })).toBeNull();
    });

    it('should return data when available', () => {
      const productId = 'product_1';
      const { properties } = mockedPropertiesByProductId[productId];
      expect(getProductProperties(mockedProductState, { productId })).toEqual(properties);
    });

    describe('Black and whitelisting of properties', () => {
      const selectorProps = { productId: 'product_1' };

      it('should get whitelisted properties', () => {
        mockedConfig = {
          type: PROPERTIES_FILTER_WHITELIST,
          properties: [mockedProperty1.label],
        };

        const properties = getProductProperties(mockedProductState, selectorProps);

        expect(properties.length).toEqual(1);
        expect(properties[0].label).toEqual(mockedProperty1.label);
        expect(properties[0].label).not.toEqual(mockedProperty2.label);
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
      expect(getProductDescription(mockedProductState, { productId })).toBeNull();
    });

    it('should return null when data is currently fetching', () => {
      const productId = 'product_2';
      expect(getProductDescription(mockedProductState, { productId })).toBeNull();
    });

    it('should return data when available', () => {
      const productId = 'product_1';
      const { description } = mockedDescriptionsByProductId[productId];
      expect(getProductDescription(mockedProductState, { productId })).toEqual(description);
    });
  });

  describe('isOrderable()', () => {
    it('should return false when the product is not available', () => {
      const productId = 'unavailable';
      expect(isOrderable(mockedProductState, { productId })).toBe(false);
    });

    it('should return false when the product does not have stock info', () => {
      const productId = 'product_4';
      expect(isOrderable(mockedProductState, { productId })).toBe(false);
    });

    it('should return false when the product is not orderable', () => {
      const productId = 'product_3';
      expect(isOrderable(mockedProductState, { productId })).toBe(false);
    });

    it('should return true when the product is orderable', () => {
      const productId = 'product_5';
      expect(isOrderable(mockedProductState, { productId })).toBe(true);
    });
  });

  describe('hasVariants()', () => {
    it('should return false when the product is not available', () => {
      const productId = 'unavailable';
      expect(hasVariants(mockedProductState, { productId })).toBe(false);
    });

    it('should return false when the product does not have variants', () => {
      const productId = 'product_5';
      expect(hasVariants(mockedProductState, { productId })).toBe(false);
    });

    it('should return true when the product has variants', () => {
      const productId = 'product_1';
      expect(hasVariants(mockedProductState, { productId })).toBe(true);
    });
  });

  describe('isFetching()', () => {
    it('should return false when the product is not available', () => {
      const productId = 'unavailable';
      expect(isFetching(mockedProductState, { productId })).toBe(false);
    });

    it('should return false when the product is not fetching', () => {
      const productId = 'product_5';
      expect(isFetching(mockedProductState, { productId })).toBe(false);
    });

    it('should return true when the product is fetching', () => {
      const productId = 'product_4';
      expect(isFetching(mockedProductState, { productId })).toBe(true);
    });
  });

  describe('isBaseProduct()', () => {
    it('should indicate base products', () => {
      expect(isBaseProduct(mockedProductState, { productId: 'product_1' })).toBe(true);
      expect(isBaseProduct(mockedProductState, { productId: 'product_2' })).toBe(false);
      expect(isBaseProduct(mockedProductState, { productId: 'product_4' })).toBe(false);
      expect(isBaseProduct(mockedProductState, { productId: 'product_5' })).toBe(false);
    });
  });

  describe('getBaseProductId()', () => {
    it('should return null when the product is not available', () => {
      const productId = 'unavailable';
      expect(getBaseProductId(mockedProductState, { productId })).toBeNull();
    });

    it('should return null when the product is not a base product', () => {
      const productId = 'product_5';
      expect(getBaseProductId(mockedProductState, { productId })).toBeNull();
    });

    it('should return the id of a base product when no variant is selected yet', () => {
      const productId = 'product_1';
      expect(getBaseProductId(mockedProductState, { productId })).toBe(productId);
    });

    it('should return the id of a base product when a variant is selected ', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      expect(getBaseProductId(mockedProductState, { productId, variantId })).toBe(productId);
    });
  });

  describe('getCurrentBaseProduct()', () => {
    it('should return null when the product is not available', () => {
      const productId = 'unavailable';
      expect(getCurrentBaseProduct(mockedProductState, { productId })).toBeNull();
    });

    it('should return null when the props do not reference a base product', () => {
      const productId = 'product_5';
      expect(getCurrentBaseProduct(mockedProductState, { productId })).toBeNull();
    });

    it('should return the the base product when no variant is selected yet', () => {
      const productId = 'product_1';
      const { productData } = mockedProductsById[productId];
      expect(getCurrentBaseProduct(mockedProductState, { productId })).toEqual(productData);
    });

    it('should return the the base product when a variant is selected', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { productData } = mockedProductsById[productId];
      expect(getCurrentBaseProduct(mockedProductState, { productId, variantId }))
        .toEqual(productData);
    });

    it('should return the the base product when only a variant is selected', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      const { productData } = mockedProductsById[productId];
      expect(getCurrentBaseProduct(mockedProductState, { variantId })).toEqual(productData);
    });
  });

  describe('getVariantId()', () => {
    it('should return null when the product is not available', () => {
      const productId = 'unavailable';
      expect(getVariantId(mockedProductState, { productId })).toBeNull();
    });

    it('should return null when the product is a simple product', () => {
      const productId = 'product_5';
      expect(getVariantId(mockedProductState, { productId })).toBeNull();
    });

    it('should return null when the product is a base product', () => {
      const productId = 'product_1';
      expect(getVariantId(mockedProductState, { productId })).toBeNull();
    });

    it('should return a productId when the product is a variant product', () => {
      const productId = 'product_2';
      expect(getVariantId(mockedProductState, { productId })).toBe(productId);
    });

    it('should return the productId of the variant if base product and variant are selected', () => {
      const productId = 'product_1';
      const variantId = 'product_2';
      expect(getVariantId(mockedProductState, { productId, variantId })).toBe(variantId);
    });
  });

  describe('isProductOrderable()', () => {
    it('should return false when the product is not available', () => {
      const productId = 'unavailable';
      expect(isProductOrderable(mockedProductState, { productId })).toBe(false);
    });

    it('should return false when the product is currently fetching', () => {
      const productId = 'product_4';
      expect(isProductOrderable(mockedProductState, { productId })).toBe(false);
    });

    it('should return false when the product is a base product', () => {
      const productId = 'product_1';
      expect(isProductOrderable(mockedProductState, { productId })).toBe(false);
    });

    it('should return false when the product is a not orderable variant', () => {
      const productId = 'product_3';
      expect(isProductOrderable(mockedProductState, { productId })).toBe(false);
    });

    it('should return true when the product is an orderable variant', () => {
      const productId = 'product_2';
      expect(isProductOrderable(mockedProductState, { productId })).toBe(true);
    });
  });
});
