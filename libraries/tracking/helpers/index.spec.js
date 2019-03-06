import core from '@shopgate/tracking-core/core/Core';
import { createScannerEventData } from './index';
import { SCANNER_TYPE_QR } from '../constants';

const scannerEvents = core.getScannerEvents();

describe('Tracking helpers', () => {
  describe('createScannerEventData()', () => {
    it('should create data for the SCAN_ACTIVATED event when there was no user interaction', () => {
      const result = createScannerEventData({
        event: scannerEvents.SCAN_ACTIVATED,
        type: SCANNER_TYPE_QR,
        userInteraction: false,
      });

      expect(result).toEqual({
        eventAction: scannerEvents.SCAN_ACTIVATED,
        userInteraction: false,
      });
    });

    it('should create data for the SCAN_ACTIVATED event when there was user interaction', () => {
      const result = createScannerEventData({
        event: scannerEvents.SCAN_ACTIVATED,
        type: SCANNER_TYPE_QR,
        userInteraction: true,
      });

      expect(result).toEqual({
        eventAction: scannerEvents.SCAN_ACTIVATED,
        userInteraction: true,
      });
    });

    it('should create data for the SCAN_FAIL event', () => {
      const result = createScannerEventData({
        event: scannerEvents.SCAN_FAIL,
        type: SCANNER_TYPE_QR,
      });

      expect(result).toEqual({
        eventAction: scannerEvents.SCAN_FAIL,
      });
    });

    it('should create data for the SCAN_SUCCESS event when the payload contains barcode scan results and an url', () => {
      const format = 'EAN_13';
      const code = '4004042410212';
      const url = '/product/abc123';

      const result = createScannerEventData({
        event: scannerEvents.SCAN_SUCCESS,
        type: SCANNER_TYPE_QR,
        payload: {
          format,
          code,
        },
        url,
      });

      expect(result).toEqual({
        eventAction: scannerEvents.SCAN_SUCCESS,
        eventLabel: `${format} - ${code} - ${url}`,
      });
    });

    it('should create data for the SCAN_SUCCESS when the payload contains barcode scan results, but no url', () => {
      const format = 'EAN_13';
      const code = '4004042410212';

      const result = createScannerEventData({
        event: scannerEvents.SCAN_SUCCESS,
        type: SCANNER_TYPE_QR,
        payload: {
          format,
          code,
        },
      });

      expect(result).toEqual({
        eventAction: scannerEvents.SCAN_SUCCESS,
        eventLabel: `${format} - not found`,
      });
    });

    it('should create data for the SCAN_SUCCESS when the scanner is not the QR Code scanner', () => {
      const format = 'EAN_13';
      const code = '4004042410212';

      const result = createScannerEventData({
        event: scannerEvents.SCAN_SUCCESS,
        type: 'SOME_TYPE',
        payload: {
          format,
          code,
        },
      });

      expect(result).toEqual({
        eventAction: scannerEvents.SCAN_SUCCESS,
      });
    });
  });
});

