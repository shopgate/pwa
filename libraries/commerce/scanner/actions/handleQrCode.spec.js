/* eslint-disable extra-rules/no-single-line-objects */
import Scanner from '@shopgate/pwa-core/classes/Scanner';
import { historyReplace, historyPop } from '@shopgate/pwa-common/actions/router';
import { fetchPageConfig } from '@shopgate/pwa-common/actions/page';
import { getPageConfigById } from '@shopgate/pwa-common/selectors/page';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { fetchProductsById, getProductById } from '@shopgate/pwa-common-commerce/product';
import { fetchCategory, getCategoryById } from '@shopgate/pwa-common-commerce/category';
import {
  QR_CODE_TYPE_HOMEPAGE,
  QR_CODE_TYPE_PRODUCT,
  QR_CODE_TYPE_COUPON,
  QR_CODE_TYPE_CATEGORY,
  QR_CODE_TYPE_SEARCH,
  QR_CODE_TYPE_PAGE,
} from '../constants';
import { parse2dsQrCode } from '../helpers';
import handleQrCode from './handleQrCode';

jest.mock('@shopgate/pwa-core/classes/AppCommand');
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
jest.mock('@shopgate/pwa-common/actions/modal/showModal', () => (
  jest.fn(options => Promise.resolve(options))
));
jest.mock('@shopgate/pwa-common-commerce/product', () => ({
  fetchProductsById: jest.fn().mockResolvedValue(null),
  getProductById: jest.fn(),
}));
jest.mock('@shopgate/pwa-common-commerce/category', () => ({
  fetchCategory: jest.fn().mockResolvedValue(null),
  getCategoryById: jest.fn(),
}));
jest.mock('../helpers', () => ({
  parse2dsQrCode: jest.fn(),
}));

describe('handleQrCode', () => {
  const dispatch = jest.fn(action => action);
  const getState = jest.fn();
  const scannerStart = jest.spyOn(Scanner, 'start').mockImplementation(() => {});

  const modalContent = {
    dismiss: null,
    confirm: 'modal.ok',
    title: 'modal.title_error',
    message: 'scanner.noResult.qrCode',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('parse2dsQrCode is called with given qr code', () => {
    handleQrCode('qr.code.from.scanner')(dispatch);
    expect(parse2dsQrCode).toHaveBeenCalledWith('qr.code.from.scanner');
  });

  describe('simple link handling', () => {
    it('should navigate to homepage', () => {
      parse2dsQrCode.mockReturnValue({ type: QR_CODE_TYPE_HOMEPAGE, link: '/' });
      handleQrCode()(dispatch);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: '/',
      });
    });

    it('should navigate to search', () => {
      parse2dsQrCode.mockReturnValue({ type: QR_CODE_TYPE_SEARCH, link: '/search?term' });
      handleQrCode()(dispatch);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: '/search?term',
      });
    });

    it('should navigate to add coupon page', () => {
      parse2dsQrCode.mockReturnValue({ type: QR_CODE_TYPE_COUPON, link: '/add_coupon/code' });
      handleQrCode()(dispatch);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: '/add_coupon/code',
      });
      expect(historyPop).toHaveBeenCalledWith();
    });
  });

  describe('PDP handling', () => {
    beforeEach(() => {
      parse2dsQrCode.mockReturnValue({ type: QR_CODE_TYPE_PRODUCT, link: '/item/SG1', data: { productId: 'SG1' } });
    });

    it('fetch product and getState is called with productId', async () => {
      await handleQrCode()(dispatch, getState);
      expect(fetchProductsById).toHaveBeenCalledWith(['SG1']);
      expect(getState).toHaveBeenCalledTimes(1);
    });

    it('should show modal, when product not found', async () => {
      getProductById.mockReturnValue(null);
      // Handle
      await handleQrCode()(dispatch, getState);
      expect(showModal).toHaveBeenCalledWith(modalContent);
      expect(scannerStart).toHaveBeenCalledTimes(1);
    });
    it('should navigate to PDP when product exists', async () => {
      getProductById.mockReturnValue(true);
      await handleQrCode()(dispatch, getState);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: '/item/SG1',
      });
    });
  });

  describe('PLP handling', () => {
    beforeEach(() => {
      parse2dsQrCode.mockReturnValue({ type: QR_CODE_TYPE_CATEGORY, link: '/category/SG2', data: { categoryId: 'SG2' } });
    });

    it('fetch category and getState is called with categoryId', async () => {
      await handleQrCode()(dispatch, getState);
      expect(fetchCategory).toHaveBeenCalledWith('SG2');
      expect(getState).toHaveBeenCalledTimes(1);
    });

    it('should show modal, when category not found', async () => {
      getCategoryById.mockReturnValue(null);
      // Handle
      await handleQrCode()(dispatch, getState);
      expect(showModal).toHaveBeenCalledWith(modalContent);
      expect(scannerStart).toHaveBeenCalledTimes(1);
    });
    it('should navigate to PLP when category exists', async () => {
      getCategoryById.mockReturnValue(true);
      await handleQrCode()(dispatch, getState);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: '/category/SG2',
      });
    });
  });

  describe('CMS handling', () => {
    beforeEach(() => {
      parse2dsQrCode.mockReturnValue({ type: QR_CODE_TYPE_PAGE, link: '/page/SG3', data: { pageId: 'SG3' } });
    });

    it('fetch page and getState is called with pageId', async () => {
      await handleQrCode()(dispatch, getState);
      expect(fetchPageConfig).toHaveBeenCalledWith('SG3');
      expect(getState).toHaveBeenCalledTimes(1);
    });

    it('should show modal, when page not found', async () => {
      getPageConfigById.mockReturnValue(null);
      // Handle
      await handleQrCode()(dispatch, getState);
      expect(showModal).toHaveBeenCalledWith(modalContent);
      expect(scannerStart).toHaveBeenCalledTimes(1);
    });
    it('should navigate to CMS when page exists', async () => {
      getPageConfigById.mockReturnValue(true);
      await handleQrCode()(dispatch, getState);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: '/page/SG3',
      });
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
