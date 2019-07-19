import { getProductVariants } from '@shopgate/pwa-common-commerce/product';
import {
  makeGetProductByCharacteristics,
  makeGetCharacteristicsFeaturedImage,
  makeGetCharacteristicsFeaturedMedia,
} from '../variants';

import {
  MEDIA_TYPE_IMAGE,
  MEDIA_TYPE_VIDEO,
} from '../../constants';

jest.mock('@shopgate/pwa-common-commerce/product', () => ({
  getProductVariants: jest.fn(),
}));

const mockedState = {
  products: [
    {
      id: '123',
      characteristics: {
        size: 'XL',
        color: 'red',
      },
      featuredImageUrl: 'http://www.abc.de',
      featuredMedia: {
        code: null,
        type: MEDIA_TYPE_IMAGE,
        url: 'http://www.abc.de',
        altText: null,
        title: null,
        sequenceId: 1,
      },
    },
    {
      id: '456',
      characteristics: {
        size: 'XL',
        color: 'blue',
      },
      featuredImageUrl: 'http://www.xyz.de',
      featuredMedia: {
        code: null,
        type: MEDIA_TYPE_IMAGE,
        url: 'http://www.xyz.de',
        altText: null,
        title: null,
        sequenceId: 1,
      },
    },
  ],
};

describe('engage > product > selectors > variants', () => {
  describe('makeGetProductByCharacteristics()', () => {
    let getProductByCharacteristic;

    beforeEach(() => {
      getProductByCharacteristic = makeGetProductByCharacteristics();
    });

    it('should return different selector instances', () => {
      expect(getProductByCharacteristic).not.toBe(makeGetProductByCharacteristics());
    });

    it('should return null', () => {
      getProductVariants.mockReturnValueOnce(null);
      expect(getProductByCharacteristic({}, { characteristics: null })).toEqual(null);
    });

    it('should return a product with one selected characteristic', () => {
      getProductVariants.mockReturnValueOnce(mockedState);
      expect(getProductByCharacteristic({}, {
        characteristics: {
          size: 'XL',
        },
      })).toEqual(mockedState.products[0]);
    });

    it('should return a product with all selected characteristics', () => {
      getProductVariants.mockReturnValueOnce(mockedState);
      expect(getProductByCharacteristic({}, {
        characteristics: {
          size: 'XL',
          color: 'blue',
        },
      })).toEqual(mockedState.products[1]);
    });
  });

  describe('makeGetCharacteristicsFeaturedImage()', () => {
    let getCharacteristicFeaturedImage;

    beforeEach(() => {
      getCharacteristicFeaturedImage = makeGetCharacteristicsFeaturedImage();
    });

    it('should return different selector instances', () => {
      expect(getCharacteristicFeaturedImage).not.toBe(makeGetCharacteristicsFeaturedImage());
    });

    it('should return null', () => {
      getProductVariants.mockReturnValueOnce(null);
      expect(getCharacteristicFeaturedImage({}, { characteristics: null })).toEqual(null);
    });

    it('should return a featured image URL', () => {
      getProductVariants.mockReturnValueOnce(mockedState);

      expect(getCharacteristicFeaturedImage({}, {
        characteristics: {
          size: 'XL',
          color: 'blue',
        },
      })).toEqual('http://www.xyz.de');
    });
  });

  describe('makeGetCharacteristicsFeaturedMedia()', () => {
    let getCharacteristicsFeaturedMedia;

    beforeEach(() => {
      getCharacteristicsFeaturedMedia = makeGetCharacteristicsFeaturedMedia();
    });

    it('should return different selector instances', () => {
      expect(getCharacteristicsFeaturedMedia).not.toBe(makeGetCharacteristicsFeaturedMedia());
    });

    it('should return null', () => {
      getProductVariants.mockReturnValueOnce(null);
      expect(getCharacteristicsFeaturedMedia({}, { characteristics: null })).toEqual(null);
    });

    it('should return featured media', () => {
      getProductVariants.mockReturnValueOnce(mockedState);

      expect(getCharacteristicsFeaturedMedia({}, {
        characteristics: {
          size: 'XL',
          color: 'blue',
        },
      })).toEqual({
        code: null,
        type: MEDIA_TYPE_IMAGE,
        url: 'http://www.xyz.de',
        altText: null,
        title: null,
        sequenceId: 1,
      });
    });

    it('should return featured media when the media types matches', () => {
      getProductVariants.mockReturnValueOnce(mockedState);
      expect(getCharacteristicsFeaturedMedia({}, {
        characteristics: {
          size: 'XL',
          color: 'blue',
        },
        type: MEDIA_TYPE_IMAGE,
      })).toEqual({
        code: null,
        type: MEDIA_TYPE_IMAGE,
        url: 'http://www.xyz.de',
        altText: null,
        title: null,
        sequenceId: 1,
      });
    });

    it('should return null when the media type does not match', () => {
      getProductVariants.mockReturnValueOnce(mockedState);

      expect(getCharacteristicsFeaturedMedia({}, {
        characteristics: {
          size: 'XL',
          color: 'blue',
        },
        type: MEDIA_TYPE_VIDEO,
      })).toBeNull();
    });
  });
});
