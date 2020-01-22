/* eslint-disable extra-rules/no-single-line-objects */
import { SCANNER_SCOPE_DEFAULT } from '@shopgate/pwa-core/constants/Scanner';
import { historyReplace, historyPop } from '@shopgate/pwa-common/actions/router';
import { fetchPageConfig } from '@shopgate/pwa-common/actions/page';
import { getPageConfigById } from '@shopgate/pwa-common/selectors/page';
import { fetchProductsById, getProductById } from '@shopgate/pwa-common-commerce/product';
import { fetchCategory, getCategory } from '@shopgate/pwa-common-commerce/category';
import {
  QR_CODE_TYPE_HOMEPAGE,
  QR_CODE_TYPE_PRODUCT,
  QR_CODE_TYPE_COUPON,
  QR_CODE_TYPE_CATEGORY,
  QR_CODE_TYPE_SEARCH,
  QR_CODE_TYPE_PAGE,
} from '../constants';
import successHandleScanner from '../action-creators/successHandleScanner';
import { parse2dsQrCode } from '../helpers';
import handleQrCode from './handleQrCode';
import handleSearch from './handleSearch';
import handleNoResults from './handleNoResults';

jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyReplace: jest.fn(),
  historyPop: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/actions/page', () => ({
  fetchPageConfig: jest.fn().mockResolvedValue(null),
}));
jest.mock('@shopgate/pwa-common/selectors/page', () => ({
  getPageConfigById: jest.fn(),
}));

jest.mock('@shopgate/pwa-common-commerce/product', () => ({
  fetchProductsById: jest.fn().mockResolvedValue(null),
  getProductById: jest.fn(),
}));
jest.mock('@shopgate/pwa-common-commerce/category', () => ({
  fetchCategory: jest.fn().mockResolvedValue(null),
  getCategory: jest.fn(),
}));
jest.mock('../helpers', () => ({
  parse2dsQrCode: jest.fn(),
}));

jest.mock('./handleSearch');
jest.mock('./handleNoResults');

const scope = SCANNER_SCOPE_DEFAULT;
const format = 'QR_CODE';
const payload = 'qr.code.from.scanner';

describe('handleQrCode', () => {
  const dispatch = jest.fn(action => action);
  const getState = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('parse2dsQrCode is called with given qr code', () => {
    handleQrCode({ scope, format, payload })(dispatch);
    expect(parse2dsQrCode).toHaveBeenCalledWith(payload);
  });

  describe('unknown link handling', () => {
    it('should trigger "no result" handling when type is undefined', async () => {
      parse2dsQrCode.mockReturnValue(null);
      const event = { scope, format, payload };
      await handleQrCode(event)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(handleNoResults(event, 'scanner.noResult.qrCode'));
    });

    it('should trigger "no result" handling when type is unknown', async () => {
      parse2dsQrCode.mockReturnValue({ type: 'unknown' });
      const event = { scope, format, payload };
      await handleQrCode(event)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(handleNoResults(event, 'scanner.noResult.qrCode'));
    });
  });

  describe('simple link handling', () => {
    it('should navigate to homepage', () => {
      parse2dsQrCode.mockReturnValue({ type: QR_CODE_TYPE_HOMEPAGE, link: '/' });
      handleQrCode({ scope, format, payload })(dispatch);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: '/',
      });
      expect(dispatch).toHaveBeenCalledWith(successHandleScanner(scope, format, payload));
    });

    it('should pass the correct phrase to the search', async () => {
      const data = {
        searchPhrase: 'Food',
      };
      parse2dsQrCode.mockReturnValue({
        type: QR_CODE_TYPE_SEARCH,
        link: '/search?Food',
        data,
      });
      const event = { scope, format, payload };
      await handleQrCode(event)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(handleSearch(data.searchPhrase));
    });

    it('should perform a search and handle it accordingly when something was found', async () => {
      const data = {
        searchPhrase: 'Food',
      };
      parse2dsQrCode.mockReturnValue({
        type: QR_CODE_TYPE_SEARCH,
        link: '/search?Food',
        data,
      });
      handleSearch.mockResolvedValue(true);

      const event = { scope, format, payload };
      await handleQrCode(event)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(handleSearch(data.searchPhrase));
      expect(dispatch).toHaveBeenCalledWith(successHandleScanner(scope, format, payload));
    });

    it('should trigger "no result" handling if the search would not find any products', async () => {
      const data = {
        searchPhrase: 'FoodWithExtra',
      };
      parse2dsQrCode.mockReturnValue({
        type: QR_CODE_TYPE_SEARCH,
        link: '/search?FoodWithExtra',
        data,
      });
      handleSearch.mockResolvedValue(false);

      const event = { scope, format, payload };
      await handleQrCode(event)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(handleNoResults(event, 'scanner.noResult.qrCode'));
    });

    it('should navigate to add coupon page', () => {
      parse2dsQrCode.mockReturnValue({ type: QR_CODE_TYPE_COUPON, link: '/add_coupon/code' });
      handleQrCode({ scope, format, payload })(dispatch);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: '/add_coupon/code',
      });
      expect(historyPop).toHaveBeenCalledWith();
      expect(dispatch).toHaveBeenCalledWith(successHandleScanner(scope, format, payload));
    });
  });

  describe('PDP handling', () => {
    beforeEach(() => {
      parse2dsQrCode.mockReturnValue({ type: QR_CODE_TYPE_PRODUCT, link: '/item/SG1', data: { productId: 'SG1' } });
    });

    it('fetch product and getState is called with productId', async () => {
      await handleQrCode({ scope, format, payload })(dispatch, getState);
      expect(fetchProductsById).toHaveBeenCalledWith(['SG1']);
      expect(getState).toHaveBeenCalledTimes(1);
    });

    it('should trigger "no result" handling when the product is not found', async () => {
      getProductById.mockReturnValue(null);
      const event = { scope, format, payload };
      await handleQrCode(event)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(handleNoResults(event, 'scanner.noResult.qrCode'));
    });

    it('should navigate to PDP when product exists', async () => {
      getProductById.mockReturnValue(true);
      await handleQrCode({ scope, format, payload })(dispatch, getState);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: '/item/SG1',
      });
      expect(dispatch).toHaveBeenCalledWith(successHandleScanner(scope, format, payload));
    });
  });

  describe('PLP handling', () => {
    beforeEach(() => {
      parse2dsQrCode.mockReturnValue({ type: QR_CODE_TYPE_CATEGORY, link: '/category/SG2', data: { categoryId: 'SG2' } });
    });

    it('fetch category and getState is called with categoryId', async () => {
      await handleQrCode({ scope, format, payload })(dispatch, getState);
      expect(fetchCategory).toHaveBeenCalledWith('SG2');
      expect(getState).toHaveBeenCalledTimes(1);
    });

    it('should trigger "no result" handling when the category is not found', async () => {
      getCategory.mockReturnValue(null);
      const event = { scope, format, payload };
      await handleQrCode(event)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(handleNoResults(event, 'scanner.noResult.qrCode'));
    });

    it('should navigate to PLP when category exists', async () => {
      getCategory.mockReturnValue(true);
      await handleQrCode({ scope, format, payload })(dispatch, getState);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: '/category/SG2',
      });
      expect(dispatch).toHaveBeenCalledWith(successHandleScanner(scope, format, payload));
    });
  });

  describe('CMS handling', () => {
    beforeEach(() => {
      parse2dsQrCode.mockReturnValue({ type: QR_CODE_TYPE_PAGE, link: '/page/SG3', data: { pageId: 'SG3' } });
    });

    it('fetch page and getState is called with pageId', async () => {
      await handleQrCode({ scope, format, payload })(dispatch, getState);
      expect(fetchPageConfig).toHaveBeenCalledWith('SG3');
      expect(getState).toHaveBeenCalledTimes(1);
    });

    it('should trigger "no result" handling when no page not found', async () => {
      getPageConfigById.mockReturnValue(null);
      const event = { scope, format, payload };
      await handleQrCode(event)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(handleNoResults(event, 'scanner.noResult.qrCode'));
    });

    it('should navigate to CMS when page exists', async () => {
      getPageConfigById.mockReturnValue(true);
      await handleQrCode({ scope, format, payload })(dispatch, getState);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: '/page/SG3',
      });
      expect(dispatch).toHaveBeenCalledWith(successHandleScanner(scope, format, payload));
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
