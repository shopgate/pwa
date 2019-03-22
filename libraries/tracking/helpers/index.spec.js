/* eslint-disable extra-rules/no-single-line-objects */
import core from '@shopgate/tracking-core/core/Core';
import { createScannerEventData } from './index';

const scannerEvents = core.getScannerEvents();

describe('Tracking helpers', () => {
  const formatQrCode = 'QR_CODE';
  const defaultEvent = scannerEvents.SCAN_SUCCESS;

  describe('createScannerEventData()', () => {
    it('should create data when there was no user interaction', () => {
      const result = createScannerEventData({
        event: defaultEvent,
        type: formatQrCode,
        userInteraction: false,
      });

      expect(result).toEqual({
        eventAction: defaultEvent,
        userInteraction: false,
      });
    });

    it('should create data when there was user interaction', () => {
      const result = createScannerEventData({
        event: defaultEvent,
        type: formatQrCode,
        userInteraction: true,
      });

      expect(result).toEqual({
        eventAction: defaultEvent,
        userInteraction: true,
      });
    });

    describe('QR Codes', () => {
      const productId = 'abc123';
      const couponCode = 'CODE';
      const categoryId = '123abc';
      const searchPhrase = 'Search';
      const pageId = 'page';

      const defaultParams = {
        event: defaultEvent,
        format: 'QR_CODE',
      };

      const defaultResult = {
        eventAction: defaultEvent,
      };

      it('should create data for the type HOMEPAGE', () => {
        const payload = 'http://2d.is/5/30186?s=30';
        const eventLabel = `${formatQrCode} - main`;
        const result = createScannerEventData({ ...defaultParams, payload });
        expect(result).toEqual({ ...defaultResult, eventLabel });
      });

      it('should create data for the type PRODUCT', () => {
        const payload = `http://2d.is/7/30186/${productId}?s=25`;
        const eventLabel = `${formatQrCode} - product - ${productId}`;
        const result = createScannerEventData({ ...defaultParams, payload });
        expect(result).toEqual({ ...defaultResult, eventLabel });
      });

      it('should create data for the type PRODUCT_WITH_COUPON', () => {
        const payload = `http://2d.is/9/30186/${productId}/${couponCode}?s=26`;
        const eventLabel = `${formatQrCode} - productcoupon - ${productId}_${couponCode}`;
        const result = createScannerEventData({ ...defaultParams, payload });
        expect(result).toEqual({ ...defaultResult, eventLabel });
      });

      it('should create data for the type COUPON', () => {
        const payload = `http://2d.is/2/${couponCode}/23729?s=27`;
        const eventLabel = `${formatQrCode} - coupon - ${couponCode}`;
        const result = createScannerEventData({ ...defaultParams, payload });
        expect(result).toEqual({ ...defaultResult, eventLabel });
      });

      it('should create data for the type CATEGORY', () => {
        const payload = `http://2d.is/e/30186/${categoryId}?s=28`;
        const eventLabel = `${formatQrCode} - category - ${categoryId}`;
        const result = createScannerEventData({ ...defaultParams, payload });
        expect(result).toEqual({ ...defaultResult, eventLabel });
      });

      it('should create data for the type SEARCH', () => {
        const payload = `http://2d.is/b/30186/${searchPhrase}?s=29`;
        const eventLabel = `${formatQrCode} - search - ${searchPhrase}`;
        const result = createScannerEventData({ ...defaultParams, payload });
        expect(result).toEqual({ ...defaultResult, eventLabel });
      });

      it('should create data for the type PAGE', () => {
        const payload = `http://2d.is/1/30186/${pageId}?s=31`;
        const eventLabel = `${formatQrCode} - page - ${pageId}`;
        const result = createScannerEventData({ ...defaultParams, payload });
        expect(result).toEqual({ ...defaultResult, eventLabel });
      });

      it('should create data for an invalid payload', () => {
        const payload = 'http://www.google.com';
        const eventLabel = `${formatQrCode}`;
        const result = createScannerEventData({ ...defaultParams, payload });
        expect(result).toEqual({ ...defaultResult, eventLabel });
      });
    });
  });

  describe('Barcodes', () => {
    it('should create data', () => {
      const format = 'EAN_13';
      const payload = '123456789';

      const result = createScannerEventData({
        event: defaultEvent,
        format,
        payload,
      });

      expect(result).toEqual({
        eventAction: defaultEvent,
        eventLabel: `${format} - ${payload}`,
      });
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
