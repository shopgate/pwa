import {
  hex2bin,
  bin2hex,
  sortObject,
  parseShopgateQrCode,
} from './index';

import {
  QR_CODE_TYPE_HOMEPAGE,
  QR_CODE_TYPE_PRODUCT,
  QR_CODE_TYPE_PRODUCT_WITH_COUPON,
  QR_CODE_TYPE_COUPON,
  QR_CODE_TYPE_CATEGORY,
  QR_CODE_TYPE_SEARCH,
  QR_CODE_TYPE_PAGE,
} from '../../constants/QRCodeTypes';

describe('data helpers', () => {
  describe('bin2hex and hex2bin conversion', () => {
    describe('successful conversions', () => {
      const tests = [
        [0, '30'],
        [4711, 34373131],
        ['0815', 30383135],
        ['my favourite product', '6d79206661766f75726974652070726f64756374'],
        ['X/5a-32:z@P $%"=?+*#', '582f35612d33323a7a4050202425223d3f2b2a23'],
      ];

      tests.forEach((test) => {
        const bin = test[0];
        const hex = test[1];

        it(`should convert "${bin}" (bin) to "${hex}" (hex)`, () => {
          expect(bin2hex(bin)).toEqual(hex.toString());
        });

        it(`should convert "${hex}" (hex) to "${bin}" (bin)`, () => {
          expect(hex2bin(hex)).toEqual(bin.toString());
        });
      });
    });

    describe('failing conversions', () => {
      const hex = 'thisisnothex';

      it(`should NOT be able to convert "${hex}" to bin`, () => {
        expect(hex2bin(hex)).toEqual(false);
      });
    });
  });

  describe('Object sorting', () => {
    it('should sort a simple object', () => {
      const sourceObject = {
        ab: 'foo',
        ef: 'bar',
        bc: 'baz',
      };

      const resultObject = {
        ab: 'foo',
        bc: 'baz',
        ef: 'bar',
      };

      expect(sortObject(sourceObject)).toEqual(resultObject);
    });

    it('should sort a nested object', () => {
      const sourceObject = {
        ab: 'foo',
        ef: {
          12: 'bla',
          56: 'blub',
          34: 'blo',
        },
        bc: [
          'abc',
          {
            78: 'test',
            def: 'test3',
            abc: 'test2',
          },
          'def',
        ],
      };

      const resultObject = {
        ab: 'foo',
        bc: [
          'abc',
          {
            78: 'test',
            abc: 'test2',
            def: 'test3',
          },
          'def',
        ],
        ef: {
          12: 'bla',
          34: 'blo',
          56: 'blub',
        },
      };

      expect(sortObject(sourceObject)).toEqual(resultObject);
    });
  });

  describe('parseShopgateQrCode()', () => {
    it('should return NULL when an invalid link was passed', () => {
      const result = parseShopgateQrCode('some string');
      expect(result).toBeNull();
    });

    it('should return NULL when an url was passed, which is not a Shopgate QR code url', () => {
      const result = parseShopgateQrCode('some string');
      expect(result).toBeNull();
    });

    it('should parse a link to the homepage', () => {
      const result = parseShopgateQrCode('http://2d.is/5/30186?s=30');
      expect(result).toEqual({
        link: '/',
        type: QR_CODE_TYPE_HOMEPAGE,
        data: {},
      });
    });

    it('should parse a link to a product page', () => {
      const result = parseShopgateQrCode('http://2d.is/7/30186/345%252F34%2523?s=25');
      expect(result).toEqual({
        link: '/item/3334352f333423',
        type: QR_CODE_TYPE_PRODUCT,
        data: { productId: '345/34#' },
      });
    });

    it('should parse a link to a product page with an additional coupon redemption', () => {
      const result = parseShopgateQrCode('http://2d.is/9/30186/345%252F34%2523/TEST-CODE?s=26');
      expect(result).toEqual({
        link: '/item/3334352f333423?coupon=TEST-CODE',
        type: QR_CODE_TYPE_PRODUCT_WITH_COUPON,
        data: { productId: '345/34#', couponCode: 'TEST-CODE' },
      });
    });

    it('should parse a link to redeem a coupon', () => {
      const result = parseShopgateQrCode('http://2d.is/2/test/23729?s=27');
      expect(result).toEqual({
        link: '/cart_add_coupon/test',
        type: QR_CODE_TYPE_COUPON,
        data: { couponCode: 'test' },
      });
    });

    it('should parse a link to a category page', () => {
      const result = parseShopgateQrCode('http://2d.is/e/30186/1337?s=28');
      expect(result).toEqual({
        link: '/category/31333337',
        type: QR_CODE_TYPE_CATEGORY,
        data: { categoryId: '1337' },
      });
    });

    it('should parse a link to a search page', () => {
      const result = parseShopgateQrCode('http://2d.is/b/30186/N%25C3%25A4hk%25C3%25A4stchen%2520Schl%25C3%25BCssel?s=29');
      expect(result).toEqual({
        link: '/search?s=Nähkästchen Schlüssel',
        type: QR_CODE_TYPE_SEARCH,
        data: { searchPhrase: 'Nähkästchen Schlüssel' },
      });
    });

    it('should parse a link to a cms page', () => {
      const result = parseShopgateQrCode('http://2d.is/1/30186/cms-page?s=31');
      expect(result).toEqual({
        link: '/page/cms-page',
        type: QR_CODE_TYPE_PAGE,
        data: { pageId: 'cms-page' },
      });
    });
  });
});
