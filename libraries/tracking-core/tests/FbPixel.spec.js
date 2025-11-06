/** @jest-environment jsdom */
/* eslint camelcase: "off" */

import { logger } from '@shopgate/pwa-core/helpers';
import isEqual from 'lodash/isEqual';
import storageMock from './helpers/localStorage-mock';
import { sgData } from './data/tracking.testData';

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('FbPixel', () => {
  let SgFbPixelTracking;
  let SgTrackingCore;
  let trackingCoreEvents;
  let spyFbq;
  let SGLink;

  beforeAll(() => {
    document.body.innerHTML = '';
    const placeholderScript = document.createElement('script');
    document.head.appendChild(placeholderScript);

    window.sgData = sgData;
    global.sgData = sgData;
    global.fbq = jest.fn();

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => storageMock(),
    });

    window.SGEvent = {};

    ({ SGLink } = jest.requireActual('../helpers/helper'));
    SgFbPixelTracking = jest.requireActual('../plugins/trackers/FbPixel').default;
    SgTrackingCore = jest.requireActual('../core/Core').default.reset();
    trackingCoreEvents = jest.requireActual('./helpers/triggerTrackingCoreEvents');
    spyFbq = global.fbq;

    // eslint-disable-next-line no-new
    new SgFbPixelTracking({
      config: {
        pixelIds: ['7117', '2222'],
      },
    });
    SgTrackingCore.registerFinished();
  });

  afterAll(() => {
    delete global.sgData;
    delete global.fbq;
  });

  it('should warn for wrong init', () => {
    // eslint-disable-next-line no-new
    new SgFbPixelTracking();
    // eslint-disable-next-line no-new
    new SgFbPixelTracking({ useNativeSdk: true });

    expect(logger.warn).toHaveBeenCalledWith('SgFbPixelTracking: pixels missing');
    expect(logger.warn).toHaveBeenCalledWith('SgFbPixelTracking: no native SDK support for this plugin');
  });

  it.skip('should load the fb sdk', () => {
    const scripts = Array.from(document.querySelectorAll('script'));
    const fbScript = scripts.find(s => s.src.includes('connect.facebook.net/en_US/fbevents.js'));
    expect(fbScript).toBeTruthy();
    expect(fbScript.async).toBe(true);
  });

  it('should send init events', () => {
    const { calls } = spyFbq.mock;
    const n = calls.length;

    expect(calls[n - 3]).toEqual(['init', '7117', undefined]);
    expect(calls[n - 2]).toEqual(['addPixelId', '2222', undefined]);
    expect(calls[n - 1]).toEqual(['track', 'PageView', undefined]);
  });

  it('should send completedRegistration', () => {
    const input = trackingCoreEvents.completedRegistration();
    const expected = ['track', 'CompleteRegistration', { content_name: input.registrationType }];

    expect(spyFbq.mock.calls).toContainEqual(expected);
    expect(spyFbq.mock.calls.filter(c => isEqual(c, expected))).toHaveLength(1);
  });

  it('should send viewContent', () => {
    const input = trackingCoreEvents.viewContent();
    const contentType = new SGLink(input.page.link).action || 'index';

    const expected = ['track', 'ViewContent', {
      content_name: input.page.name,
      content_ids: [''],
      content_type: contentType,
    }];

    expect(spyFbq.mock.calls).toContainEqual(expected);
    expect(spyFbq.mock.calls.filter(c => isEqual(c, expected))).toHaveLength(1);
  });

  it('should send addedPaymentInfo', () => {
    trackingCoreEvents.addedPaymentInfo();

    const expected = ['track', 'AddPaymentInfo', undefined];
    expect(spyFbq.mock.calls).toContainEqual(expected);
    expect(spyFbq.mock.calls.filter(c => isEqual(c, expected))).toHaveLength(1);
  });

  it('should send purchase', () => {
    const input = trackingCoreEvents.purchase();
    const productIds = input.order.products.map(p => p.productNumber || p.uid);

    const expectedPayload = {
      content_ids: productIds,
      content_type: 'product',
      value: parseFloat(input.order.amount.gross),
      currency: input.order.amount.currency,
    };
    if (productIds.length === 1) {
      expectedPayload.content_name = input.order.products[0].name;
    }

    const expected = ['track', 'Purchase', expectedPayload];

    expect(spyFbq.mock.calls).toContainEqual(expected);
    expect(spyFbq.mock.calls.filter(c => isEqual(c, expected))).toHaveLength(1);
  });

  it('should send initiatedCheckout', () => {
    const input = trackingCoreEvents.initiatedCheckout();
    const productIds = input.cart.products.map(p => p.productNumber || p.uid);

    const expectedPayload = {
      content_ids: productIds,
      content_type: 'product',
      value: parseFloat(input.cart.amount.gross),
      currency: input.cart.amount.currency,
      num_items: input.cart.productsCount,
    };
    if (productIds.length === 1) {
      expectedPayload.content_name = input.cart.products[0].name;
    }

    const expected = ['track', 'InitiateCheckout', expectedPayload];

    expect(spyFbq.mock.calls).toContainEqual(expected);
    expect(spyFbq.mock.calls.filter(c => isEqual(c, expected))).toHaveLength(1);
  });

  it('should send addToCart', () => {
    const input = trackingCoreEvents.addToCart();

    let value = 0;
    const productIds = input.products.map((product) => {
      value += parseFloat(product.amount.gross);
      return product.productNumber || product.uid;
    });

    const expectedPayload = {
      content_ids: productIds,
      content_type: 'product',
      value,
      currency: input.products[0].amount.currency,
    };
    if (productIds.length === 1) {
      expectedPayload.content_name = input.products[0].name;
    }

    const expected = ['track', 'AddToCart', expectedPayload];

    expect(spyFbq.mock.calls).toContainEqual(expected);
    expect(spyFbq.mock.calls.filter(c => isEqual(c, expected))).toHaveLength(1);
  });

  it('should send addToWishlist', () => {
    const input = trackingCoreEvents.addToWishlist();

    let value = 0;
    const productIds = input.favouriteListProducts.map((product) => {
      value += parseFloat(product.unit_amount_with_tax) / 100;
      return product.product_number_public || product.product_number;
    });

    const expectedPayload = {
      content_ids: productIds,
      content_type: 'product',
      value,
      currency: input.favouriteListProducts[0].currency_id,
    };
    if (productIds.length === 1) {
      expectedPayload.content_name = input.favouriteListProducts[0].name;
    }

    const expected = ['track', 'AddToWishlist', expectedPayload];

    expect(spyFbq.mock.calls).toContainEqual(expected);
    expect(spyFbq.mock.calls.filter(c => isEqual(c, expected))).toHaveLength(1);
  });

  it('should send search', () => {
    const input = trackingCoreEvents.search();
    const productIds = input.products.map(p => p.productNumber || p.uid);

    const expected = ['track', 'Search', {
      content_ids: productIds,
      content_type: 'product',
      search_string: input.search.query,
    }];

    expect(spyFbq.mock.calls).toContainEqual(expected);
    expect(spyFbq.mock.calls.filter(c => isEqual(c, expected))).toHaveLength(1);
  });

  it('should be added to the window object', () => {
    expect(global.window.SgFbPixelTracking).toBe(SgFbPixelTracking);
  });
});
