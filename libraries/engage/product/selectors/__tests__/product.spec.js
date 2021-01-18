import {
  makeGetProductProperties,
  makeGetProductCharacteristics,
  makeGetProductFeaturedMedia,
} from '../product';
import { wrapMemoizedSelector } from '../helpers';

const mockState = {
  product: {
    productsById: {
      123: {
        productData: {

          startDate: '2019-04-01T10:00:00.000Z',
          endDate: '2019-04-10T10:00:00.000Z',
          characteristics: [{
            id: '01-color',
            label: 'Color',
            // more properties available but of no interest for tests
          }],
          featuredMedia: {
            code: null,
            type: 'image',
            url: 'https://example.com/image',
            altText: null,
            title: null,
            sequenceId: 1,
          },
        },
      },
      456: {
        productData: {

          characteristics: null,
        },
      },
    },
    propertiesByProductId: {
      123: {
        properties: [{
          label: 'Test',
          value: '123',
        }],
      },
      456: {
        properties: null,
      },
    },
  },
};

describe('engage > product > selectors', () => {
  describe('getProductProperties()', () => {
    let getProductProperties;
    beforeEach(() => {
      getProductProperties = wrapMemoizedSelector(makeGetProductProperties());
    });

    it('should return null if a properties state can not be found', () => {
      const result = getProductProperties(mockState, { productId: '012' });
      expect(result).toEqual(null);
    });

    it('should return null of no properties have been received for the product', () => {
      const result = getProductProperties(mockState, { productId: '456' });
      expect(result).toEqual(null);
    });

    it('should return properties if they are set for the product', () => {
      const result = getProductProperties(mockState, { productId: '123' });
      expect(result).toEqual([{
        label: 'Test',
        value: '123',
      }]);
    });
  });

  describe('getProductCharacteristics()', () => {
    let getProductCharacteristics;
    beforeEach(() => {
      getProductCharacteristics = wrapMemoizedSelector(makeGetProductCharacteristics());
    });

    it('should return null if a product state can not be found', () => {
      const result = getProductCharacteristics(mockState, { productId: '012' });
      expect(result).toEqual(null);
    });

    it('should return null of no characteristics are available for the product', () => {
      const result = getProductCharacteristics(mockState, { productId: '456' });
      expect(result).toEqual(null);
    });

    it('should return all characteristics if available for the product', () => {
      const result = getProductCharacteristics(mockState, { productId: '123' });
      expect(result).toEqual([{
        id: '01-color',
        label: 'Color',
      }]);
    });
  });

  describe('getProductFeaturedMedia', () => {
    let getProductFeaturedMedia;
    beforeEach(() => {
      getProductFeaturedMedia = makeGetProductFeaturedMedia();
    });

    it('should return null if a product state can not be found', () => {
      const result = getProductFeaturedMedia(mockState, { productId: '012' });
      expect(result).toEqual(null);
    });

    it('should return null of no featured media is available for the product', () => {
      const result = getProductFeaturedMedia(mockState, { productId: '456' });
      expect(result).toEqual(null);
    });

    it('should return featured media if available for the product', () => {
      const result = getProductFeaturedMedia(mockState, { productId: '123' });
      expect(result).toEqual(mockState.product.productsById[123].productData.featuredMedia);
    });
  });
});
