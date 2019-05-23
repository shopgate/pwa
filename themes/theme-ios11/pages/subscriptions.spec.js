/* eslint-disable extra-rules/no-single-line-objects */

import { SCANNER_MIN_APP_LIB_VERSION } from '@shopgate/engage/core/constants/Scanner';
import { redirects } from '@shopgate/pwa-common/collections';
import { LoadingProvider } from '@shopgate/engage/core';
import { appWillStart$ } from '@shopgate/engage/core';
import { ORDERS_PATH } from '@shopgate/engage/checkout';
import { LEGACY_URL as ORDERS_LEGACY_PATH } from '@shopgate/pwa-common-commerce/orders/constants';
import { SCANNER_TYPE_BARCODE, SCANNER_SCOPE_DEFAULT } from '@shopgate/engage/core';
import {
  grantCameraPermissions,
  getScannerRoute,
  SCANNER_PATH,
} from '@shopgate/pwa-common-commerce/scanner';

import subscriptions from './subscriptions';

jest.unmock('@shopgate/engage/core');
jest.mock('@shopgate/engage/core/classes/AppCommand');
jest.mock('@shopgate/pwa-common-commerce/scanner/actions/grantCameraPermissions', () =>
  jest.fn().mockResolvedValue(true));

const currentPath = '/some/path';

const mockState = {
  router: {
    currentRoute: {
      pathname: currentPath,
    },
  },
  client: {
    info: {
      libVersion: SCANNER_MIN_APP_LIB_VERSION,
    },
  },
};

describe('Pages Subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn().mockImplementation(input => input);
  const getState = jest.fn().mockReturnValue(mockState);

  let setRedirectsSpy;
  let unsetLoadingSpy;

  beforeAll(() => {
    setRedirectsSpy = jest.spyOn(redirects, 'set');
    unsetLoadingSpy = jest.spyOn(LoadingProvider, 'unsetLoading');
  });

  beforeEach(() => {
    jest.clearAllMocks();
    subscriptions(subscribe);
  });

  it('should subscribe as expected', async () => {
    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  describe('appWillStart$', () => {
    let stream;
    let callback;

    beforeEach(() => {
      [[stream, callback]] = subscribe.mock.calls;
      redirects.constructor();
      callback({ dispatch, getState });
    });

    it('should subscribe as expected', () => {
      expect(stream).toBe(appWillStart$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should register redirects', () => {
      expect(setRedirectsSpy).toHaveBeenCalledTimes(2);
      expect(setRedirectsSpy).toHaveBeenCalledWith(ORDERS_PATH, ORDERS_LEGACY_PATH);
      expect(setRedirectsSpy).toHaveBeenCalledWith(SCANNER_PATH, expect.any(Function));
    });

    describe('Scanner redirects', () => {
      const pathname = getScannerRoute(SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE);
      const action = {
        params: { pathname },
      };
      let scannerHandler;

      beforeEach(() => {
        ([, [, scannerHandler]] = setRedirectsSpy.mock.calls);
      });

      it('should redirect to the scanner page when camera permissions are granted', async () => {
        expect(scannerHandler).toBeInstanceOf(Function);
        await expect(scannerHandler({ action })).resolves.toBe(pathname);
        expect(unsetLoadingSpy).toHaveBeenCalledTimes(1);
        expect(unsetLoadingSpy).toHaveBeenCalledWith(currentPath);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(grantCameraPermissions());
      });

      it('should not redirect to the scanner page when camera permissions are not granted', async () => {
        grantCameraPermissions.mockResolvedValueOnce(false);
        await expect(scannerHandler({ action })).resolves.toBe(null);
        expect(unsetLoadingSpy).toHaveBeenCalledTimes(1);
        expect(unsetLoadingSpy).toHaveBeenCalledWith(currentPath);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(grantCameraPermissions());
      });

      it('should not redirect to the scanner page, when the app has no scanner support', async () => {
        const state = {
          ...mockState,
          client: {
            info: {
              libVersion: '10.0',
            },
          },
        };

        getState.mockReturnValueOnce(state);
        getState.mockReturnValueOnce(state);

        await expect(scannerHandler({ action })).resolves.toBe(null);
        expect(unsetLoadingSpy).toHaveBeenCalledTimes(1);
        expect(unsetLoadingSpy).toHaveBeenCalledWith(currentPath);
        expect(dispatch).not.toHaveBeenCalled();
      });
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
