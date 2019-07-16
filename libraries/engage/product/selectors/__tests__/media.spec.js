import {
  getProductState,
  getProductId,
} from '@shopgate/pwa-common-commerce/product/selectors/product';

import {
  MEDIA_TYPE_IMAGE,
  MEDIA_TYPE_VIDEO,
} from '../../constants';

import {
  makeGetProductMediaState,
  makeGetProductMedia,
} from '../media';

jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProductState: jest.fn(),
  getProductId: jest.fn(),
}));

const mockedState = {
  mediaByProductId: {
    ABC: {
      isFetching: false,
      media: [{
        code: null,
        type: MEDIA_TYPE_IMAGE,
        url: 'http://www.abc.de',
        altText: null,
        title: null,
        sequenceId: 1,
      }, {
        code: null,
        type: MEDIA_TYPE_VIDEO,
        url: 'http://www.abc.de',
        altText: null,
        title: null,
        sequenceId: 2,
      }],
    },
    XYZ: {
      isFetching: true,
      media: [],
    },
  },
};

describe('engage > product > selectors > media', () => {
  beforeAll(() => {
    getProductState.mockReturnValue(mockedState);
    getProductId.mockImplementation((_, props = {}) => props.productId);
  });

  describe('getProductMediaState()', () => {
    let getProductMediaState;

    beforeEach(() => {
      getProductMediaState = makeGetProductMediaState();
    });

    it('should return different selector instances', () => {
      expect(getProductMediaState).not.toBe(makeGetProductMediaState());
    });

    it('should return the state', () => {
      const result = getProductMediaState({});
      expect(result).toEqual(mockedState.mediaByProductId);
    });
  });

  describe('getProductMedia()', () => {
    let getProductMedia;

    beforeEach(() => {
      getProductMedia = makeGetProductMedia();
    });

    it('should return different selector instances', () => {
      expect(getProductMedia).not.toBe(makeGetProductMedia());
    });

    it('should return NULL when no product media was found', () => {
      const result = getProductMedia({}, { productId: '123' });
      expect(result).toBeNull();
    });

    it('should return NULL when product media is fetching', () => {
      const result = getProductMedia({}, { productId: 'XYZ' });
      expect(result).toBeNull();
    });

    it('should return media when no types are passed', () => {
      const result = getProductMedia({}, { productId: 'ABC' });
      expect(result).toEqual(mockedState.mediaByProductId.ABC.media);
    });

    it('should return filtered media when a type is passed', () => {
      const result = getProductMedia({}, {
        productId: 'ABC',
        types: [MEDIA_TYPE_VIDEO],
      });
      expect(result).toEqual([mockedState.mediaByProductId.ABC.media[1]]);
    });
  });
});
