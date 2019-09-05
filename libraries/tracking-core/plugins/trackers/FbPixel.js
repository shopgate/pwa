/* global fbq */
import { logger } from '@shopgate/pwa-core/helpers';
import BasePlugin from '../Base';

/**
 * Tracking plugin for Facebook
 */
class FbPixel extends BasePlugin {
  /**
   * Constructor
   *
   * @param {Object} options Common Tracking Configuration
   * @param {boolean} [options.overrideUnified] If true -> overrides our unified tracking system
   * @param {boolean} [options.useNativeSdk] If true -> send data via our unified tracking system
   *   to the native sdk
   * @param {Object} [options.config] Configuration for facebook pixel tracking
   * @param {Array} [options.config.pixelIds] List of Facebook pixels
   */
  constructor(options) {
    const trackerName = 'facebookPixel';

    const extendedDefaults = {
      config: {
        pixelIds: [],
      },
    };

    super(trackerName, options, extendedDefaults);

    if (this.options.useNativeSdk) {
      logger.warn('SgFbPixelTracking: no native SDK support for this plugin');
      return;
    }

    if (!this.options.config.pixelIds.length) {
      logger.warn('SgFbPixelTracking: pixels missing');
      return;
    }

    this.initPlugin();
  }

  /**
   * Initiate and setup the SDK
   */
  initPlugin() {
    // Load the fb pixel tracking sdk
    /* eslint-disable eslint-comments/no-unlimited-disable */
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    const pixelsForInit = this.options.config.pixelIds.slice(0);
    const firstPixel = pixelsForInit.shift();

    FbPixel.sendToFb(firstPixel.toString(), undefined, 'init');

    /*
     * Add multiple pixel Ids.
     * Warning: This is not official supported by facebook, but seems to work
     */
    pixelsForInit.forEach((pixel) => {
      FbPixel.sendToFb(pixel.toString(), undefined, 'addPixelId');
    });

    /**
     * The pixel tracking have a PageView und ViewContent Event. The PageView event should be called
     * on every page. It has no params
     */
    FbPixel.sendToFb('PageView');

    // Register for some events

    this.register.completedRegistration((data) => {
      FbPixel.sendToFb('CompleteRegistration', {
        content_name: data.registrationMethod,
      });
    });

    this.register.viewContent((data, rawData) => {
      const fbParams = {
        content_type: data.type,
      };

      if (data.type === 'product' && typeof rawData !== 'undefined') {
        fbParams.content_ids = [data.id];
        fbParams.content_name = rawData.product.name;
        fbParams.value = parseFloat(this.getPrice(rawData.product.amount));
        fbParams.currency = rawData.product.amount.currency;
      } else {
        fbParams.content_ids = [data.id];
        fbParams.content_name = data.name;
      }

      FbPixel.sendToFb('ViewContent', fbParams);
    });

    this.register.addedPaymentInfo(() => {
      FbPixel.sendToFb('AddPaymentInfo');
    });

    this.register.purchase((data) => {
      const productIds = FbPixel.getProductIds(data.items);

      const fbParams = {
        content_ids: productIds,
        content_type: data.type,
        value: this.getPrice(data),
        currency: data.currency,
      };

      if (productIds.length === 1) {
        fbParams.content_name = data.items[0].name;
      }

      FbPixel.sendToFb('Purchase', fbParams);
    });

    this.register.initiatedCheckout((data, rawData) => {
      const productIds = FbPixel.getProductIds(rawData.cart.products);

      const fbParams = {
        content_ids: productIds,
        content_type: 'product',
        value: this.getPrice(data),
        currency: data.currency,
        num_items: data.numItems,
      };

      if (productIds.length === 1) {
        fbParams.content_name = rawData.cart.products[0].name;
      }

      FbPixel.sendToFb('InitiateCheckout', fbParams);
    });

    this.register.addToCart((data) => {
      FbPixel.sendToFb('AddToCart', this.getParamsForAddToCartAndWishlist(data));
    });

    this.register.addToWishlist((data) => {
      FbPixel.sendToFb('AddToWishlist', this.getParamsForAddToCartAndWishlist(data));
    });

    this.register.search((data, rawData) => {
      const productIds = FbPixel.getProductIds(rawData.products);

      const fbParams = {
        content_ids: productIds,
        content_type: data.type,
        search_string: data.query,
      };

      FbPixel.sendToFb('Search', fbParams);
    });
  }

  /**
   * Send data to the facebook tracker
   * @param {string} eventName Name of the event
   * @param {Object} [params] Params for the event
   * @param {string} [typeParam] Type of the tracker call
   * @returns {void}
   */
  static sendToFb(eventName, params, typeParam) {
    const type = typeParam || 'track';

    fbq(type, eventName, params);
  }

  /**
   * Extract the product Ids from an array with products
   *
   * @param {Array} products Array with products
   * @returns {Array} Array of product Ids
   */
  static getProductIds(products) {
    return products.map(product => product.productNumber || product.uid || product.id);
  }

  /**
   * Returns the correct price net or gross price. Depending on this.options.useNetPrices
   *
   * @param {Object} amount Price Object
   * @returns {number|string} net or gross price
   */
  getPrice(amount) {
    if (this.options.useNetPrices) {
      return amount.priceNet || amount.valueNet || amount.net || amount.revenueNet;
    }
    return amount.priceGross || amount.valueGross || amount.gross || amount.revenueGross;
  }

  /**
   * Returns the params for the AddToCart and AddToWishlist events
   *
   * @param {Object} data Converted data from the parent plugin
   * @returns {Object} Params for the fb event
   */
  getParamsForAddToCartAndWishlist(data) {
    const productIds = FbPixel.getProductIds(data.items);
    let value = 0;
    let currency = 'EUR';

    data.items.forEach((item) => {
      value += this.getPrice(item);
      currency = item.currency; // eslint-disable-line prefer-destructuring
    });

    const fbParams = {
      content_ids: productIds,
      content_type: data.type,
      value,
      currency,
    };

    if (productIds.length === 1) {
      fbParams.content_name = data.items[0].name;
    }

    return fbParams;
  }
}

window.SgFbPixelTracking = FbPixel;

export default FbPixel;
