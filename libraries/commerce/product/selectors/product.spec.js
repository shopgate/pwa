import {
  getProductProperties,
  isBaseProduct,
} from './product';
import {
  PROPERTIES_FILTER_BLACKLIST,
  PROPERTIES_FILTER_WHITELIST,
} from '../constants/';

let mockedConfig;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get productPropertiesFilter() {
    return mockedConfig;
  },
}));

describe('Product selectors', () => {
  describe('getProductProperties', () => {
    const property1 = {
      label: 'Article No.',
      value: '9252529931',
    };
    const property2 = {
      label: 'Manufacturer',
      value: 'Nike',
    };

    let mockedState = {
      product: {
        propertiesByProductId: {
          product1: {
            isFetching: false,
            properties: [
              property1,
              property2,
            ],
          },
        },
      },
    };

    const selectorProps = { productId: 'product1' };

    beforeEach(() => {
      // Deepcopy
      mockedState = JSON.parse(JSON.stringify(mockedState));
    });

    it('should get whitelisted properties', () => {
      mockedConfig = {
        type: PROPERTIES_FILTER_WHITELIST,
        properties: [property1.label],
      };

      const properties = getProductProperties(mockedState, selectorProps);
      expect(properties.length).toEqual(1);
      expect(properties[0].label).toEqual(property1.label);
      expect(properties[0].label).not.toEqual(property2.label);
    });

    it('should not get blacklisted properties', () => {
      mockedConfig = {
        type: PROPERTIES_FILTER_BLACKLIST,
        properties: [property1.label],
      };
      const properties = getProductProperties(mockedState, selectorProps);
      expect(properties.length).toEqual(1);
      expect(properties[0].label).not.toEqual(property1.label);
      expect(properties[0].label).toEqual(property2.label);
    });

    it('should not filter with invalid type', () => {
      mockedConfig = {
        type: 'foo',
        properties: [property1.label],
      };

      const properties = getProductProperties(mockedState, selectorProps);
      expect(properties.length).toEqual(2);
      expect(properties).toEqual([
        property1,
        property2,
      ]);
    });

    it('should not filter when no config is set', () => {
      mockedConfig = null;

      const properties = getProductProperties(mockedState, selectorProps);
      expect(properties.length).toEqual(2);
      expect(properties).toEqual([
        property1,
        property2,
      ]);
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

  describe('getIsBaseProduct', () => {
    const mockedBaseProductState = {
      product: {
        productsById: {
          product_1: {
            isFetching: false,
            productData: {
              baseProductId: null,
              id: 'product_1',
              flags: {
                hasVariants: true,
              },
            },
          },
          product_2: {
            isFetching: false,
            productData: {
              baseProductId: 'product_1',
              id: 'product_2',
              flags: {
                hasVariants: false,
              },
            },
          },
          product_3: {
            isFetching: true,
            productData: null,
          },
          product_4: {
            isFetching: false,
            productData: {
              baseProductId: null,
              id: 'product_4',
              flags: {
                hasVariants: false,
              },
            },
          },
        },
      },
    };

    it('should indicate base product', () => {
      expect(isBaseProduct(mockedBaseProductState, { productId: 'product_1' })).toBe(true);
      expect(isBaseProduct(mockedBaseProductState, { productId: 'product_2' })).toBe(false);
      expect(isBaseProduct(mockedBaseProductState, { productId: 'product_3' })).toBe(null);
      expect(isBaseProduct(mockedBaseProductState, { productId: 'product_4' })).toBe(false);
    });
  });
});
