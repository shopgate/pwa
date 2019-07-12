import { getProductVariants } from '@shopgate/pwa-common-commerce/product';
import {
  makeGetProductByCharacteristic,
  makeGetCharacteristicFeaturedImage,
} from '../variants';
import { wrapMemoizedSelector } from '../helpers';

jest.mock('@shopgate/pwa-common-commerce/product', () => ({
  getProductVariants: jest.fn(),
}));

describe('engage > product > selectors > variants', () => {
  describe('makeGetProductByCharacteristic()', () => {
    let getProductByCharacteristicWrapped;

    beforeEach(() => {
      getProductByCharacteristicWrapped = wrapMemoizedSelector(makeGetProductByCharacteristic());
    });

    it('should return null', () => {
      getProductVariants.mockReturnValueOnce(null);
      expect(getProductByCharacteristicWrapped({}, { characteristic: null })).toEqual(null);
    });

    it('should return a product', () => {
      getProductVariants.mockReturnValueOnce({
        products: [
          {
            id: '123',
            characteristics: {
              label: 'test',
              value: 'foo',
            },
          },
          {
            id: '456',
            characteristics: {
              label: 'bar',
              value: 'buz',
            },
          },
        ],
      });
      expect(getProductByCharacteristicWrapped({}, {
        characteristic: {
          label: 'bar',
          value: 'buz',
        },
      })).toEqual({
        id: '456',
        characteristics: {
          label: 'bar',
          value: 'buz',
        },
      });
    });
  });

  describe('makeGetCharacteristicFeaturedImage()', () => {
    let getCharacteristicFeaturedImage;

    beforeEach(() => {
      getCharacteristicFeaturedImage = wrapMemoizedSelector(makeGetCharacteristicFeaturedImage());
    });

    it('should return null', () => {
      getProductVariants.mockReturnValueOnce(null);
      expect(getCharacteristicFeaturedImage({}, { characteristic: null })).toEqual(null);
    });

    it('should return a featured image URL', () => {
      getProductVariants.mockReturnValueOnce({
        products: [
          {
            id: '123',
            featureImageUrl: 'http://www.abc.de',
            characteristics: {
              label: 'test',
              value: 'foo',
            },
          },
          {
            id: '456',
            featuredImageUrl: 'http://www.xyz.de',
            characteristics: {
              label: 'bar',
              value: 'buz',
            },
          },
        ],
      });

      expect(getCharacteristicFeaturedImage({}, {
        characteristic: {
          label: 'bar',
          value: 'buz',
        },
      })).toEqual('http://www.xyz.de');
    });
  });
});
