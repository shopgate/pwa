/* eslint-disable extra-rules/no-single-line-objects */
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
  SCANNER_TYPE_IMAGE,
} from '@shopgate/pwa-core/constants/Scanner';
import { getSearchRoute } from '@shopgate/pwa-common-commerce/search';
import { getCategoryRoute } from '@shopgate/pwa-common-commerce/category';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product';
import {
  QR_CODE_TYPE_HOMEPAGE,
  QR_CODE_TYPE_PRODUCT,
  QR_CODE_TYPE_PRODUCT_WITH_COUPON,
  QR_CODE_TYPE_COUPON,
  QR_CODE_TYPE_CATEGORY,
  QR_CODE_TYPE_SEARCH,
  QR_CODE_TYPE_PAGE,
  QR_CODE_HOST_2DS,
  SCANNER_PATH,
} from '../constants';
import { is2dsQrCode, parse2dsQrCode, getScannerRoute } from './index';

describe('scanner helpers', () => {
  describe('is2dsQrCode', () => {
    it('should return true when link is 2ds', () => {
      expect(is2dsQrCode(`http://${QR_CODE_HOST_2DS}/uri`)).toBe(true);
    });
    it('should return false when link is not 2ds', () => {
      expect(is2dsQrCode('http://site.com/uri')).toBe(false);
    });
  });

  describe('parse2dsQrCode', () => {
    describe('invalid 2ds link', () => {
      it('should return NULL when an invalid link was passed', () => {
        expect(parse2dsQrCode('some string')).toBeNull();
      });

      it('should return NULL when url is not 2ds', () => {
        expect(parse2dsQrCode('http://site.com/uri')).toBeNull();
      });
    });

    describe('valid 2ds link', () => {
      it('should parse a homepage link', () => {
        const result = parse2dsQrCode(`http://${QR_CODE_HOST_2DS}/5/30186?s=30`);
        expect(result).toEqual({
          link: '/',
          type: QR_CODE_TYPE_HOMEPAGE,
          data: {},
        });
      });

      it('should parse a PDP link', () => {
        const result = parse2dsQrCode(`http://${QR_CODE_HOST_2DS}/7/30186/345%252F34%2523?s=25`);
        expect(result).toEqual({
          link: getProductRoute('345/34#'),
          type: QR_CODE_TYPE_PRODUCT,
          data: { productId: '345/34#' },
        });
      });

      it('should parse add product with coupon link', () => {
        const result = parse2dsQrCode(`http://${QR_CODE_HOST_2DS}/9/30186/345%252F34%2523/TEST%252FCODE%2523?s=26`);
        expect(result).toEqual({
          link: '/cart_add_product/345%2F34%23/TEST%2FCODE%23',
          type: QR_CODE_TYPE_PRODUCT_WITH_COUPON,
          data: { productId: '345/34#', couponCode: 'TEST/CODE#' },
        });
      });

      it('should parse a coupon link', () => {
        const result = parse2dsQrCode(`http://${QR_CODE_HOST_2DS}/2/TEST-CODE/23729?s=27`);
        expect(result).toEqual({
          link: '/cart_add_coupon/TEST-CODE',
          type: QR_CODE_TYPE_COUPON,
          data: { couponCode: 'TEST-CODE' },
        });
      });

      it('should parse a PLP link', () => {
        const result = parse2dsQrCode(`http://${QR_CODE_HOST_2DS}/e/30186/1337?s=28`);
        expect(result).toEqual({
          link: getCategoryRoute('1337'),
          type: QR_CODE_TYPE_CATEGORY,
          data: { categoryId: '1337' },
        });
      });

      it('should parse a search link', () => {
        const result = parse2dsQrCode(`http://${QR_CODE_HOST_2DS}/b/30186/N%25C3%25A4hk%25C3%25A4stchen%2520Schl%25C3%25BCssel?s=29`);
        expect(result).toEqual({
          link: getSearchRoute('Nähkästchen Schlüssel'),
          type: QR_CODE_TYPE_SEARCH,
          data: { searchPhrase: 'Nähkästchen Schlüssel' },
        });
      });

      it('should parse a CMS page link', () => {
        const result = parse2dsQrCode(`http://${QR_CODE_HOST_2DS}/1/30186/cms-page?s=31`);
        expect(result).toEqual({
          link: '/page/cms-page',
          type: QR_CODE_TYPE_PAGE,
          data: { pageId: 'cms-page' },
        });
      });
    });
  });

  describe('getScannerRoute', () => {
    it('should create a route without passing parameters', () => {
      const route = getScannerRoute();
      const expected = `${SCANNER_PATH}?scope=${SCANNER_SCOPE_DEFAULT}&type=${SCANNER_TYPE_BARCODE}`;
      expect(route).toBe(expected);
    });

    it('should create a route when a value is passed for the scope parameter', () => {
      const route = getScannerRoute('custom');
      const expected = `${SCANNER_PATH}?scope=custom&type=${SCANNER_TYPE_BARCODE}`;
      expect(route).toBe(expected);
    });

    it('should create a route when a values are passed for both parameters', () => {
      const route = getScannerRoute('custom', SCANNER_TYPE_IMAGE);
      const expected = `${SCANNER_PATH}?scope=custom&type=${SCANNER_TYPE_IMAGE}`;
      expect(route).toBe(expected);
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
