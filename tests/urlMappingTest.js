/*
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chai from 'chai';
import sgUrlMapper from '../helpers/urlMapping';

const expect = chai.expect;

const base = 'http://testshop.shopgate.localdev.cc';
const pathLive = '/';
const pathDevelopment = '/php/shopgate/';
const pathApp = 'sg_app_resources/0123456789/';

describe('urlMapping', () => {
  it('should test relative url', () => {
    expect(sgUrlMapper('/checkout_payment/payment/change_credit_card').public)
      .to.equal('checkout_payment_and_shipping/payment/change_credit_card');
  });

  it('should test urls with parameters', () => {
    const testurl =
      'http://testshop.shopgate.localdev.cc/php/shopgate/register?emos_sid=aaa&emos_vid=aaa&_ga=1.2.3.4__utma=123.123.123&__utmb=123.123.123&__utmc=1.2.3.4&__utmx=-&__utmz=1.2.3.4.5.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)&__utmv=-&__utmk=123456#abc';

    expect(sgUrlMapper(testurl)).to.deep.equal({
      public: 'register',
      private: 'register',
    });

    const testurlWithAllowedParam =
          'http://testshop.shopgate.localdev.cc/php/shopgate/register?_gaFOO=1&emos_sid=aaa&emos_vid=aaa&allow=me&_ga=1.2.3.4__utma=123.123.123&__utmb=123.123.123&__utmc=1.2.3.4&__utmx=-&__utmz=1.2.3.4.5.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)&__utmv=-&__utmk=123456#abc';

    expect(sgUrlMapper(testurlWithAllowedParam)).to.deep.equal({
      public: 'register?_gaFOO=1&allow=me',
      private: 'register',
    });
  });

  it('should test cart mapping', () => {
    // Fake data for empty cart
    const sgDataEmpty = {
      cart: {
        productsCount: 0,
        products: [],
      },
    };
    expect(sgUrlMapper(`${base}/cart`, sgDataEmpty).public).to.equal('cart_empty');

    // Fake data for cart with one item
    const sgDataFull = {
      cart: {
        productsCount: 1,
        products: [
          {
            uid: 'SG12',
            parentUid: null,
            productNumber: 'item_number_public-12',
            name: 'Produkt mit 0% MwSt. - §25a',
            amount: {
              currency: 'EUR',
              net: '100.00',
              gross: '100.00',
              tax: '0.00',
              taxRate: '0.00',
            },
            tags: [],
            additionalShippingCosts: {
              perOrder: '0',
              perUnit: '0',
            },
            quantity: '1',
            stockQuantity: 84,
          },
        ],
      },
    };
    expect(sgUrlMapper(`${base}/cart`, sgDataFull).public).to.equal('cart');
  });

  it('should test favourite list mappings', () => {
    // Test empty favourite list
    const sgDataEmpty = {
      favouriteList: [],
    };
    expect(sgUrlMapper(`${base}/favourite_list`, sgDataEmpty).public).to.equal('favourite_list_empty');

    // Test favourite list
    const sgDataFull = {
      favouriteList: {
        products: [
          {
            uid: 'SG113',
            productNumber: 'item_number_public-113',
            name: 'Produkt für die Einlösung eines Gutscheins',
            amount: {
              currency: 'EUR',
              net: '84.03',
              gross: '100.00',
              tax: '15.97',
              taxRate: '19.00',
            },
            tags: [],
            stockQuantity: 51,
          },
        ],
      },
    };
    expect(sgUrlMapper(`${base}/favourite_list`, sgDataFull).public).to.equal('favourite_list');
  });

  it('should test one-to-one mappings', () => {
    const mappingTests = [
      ['payment_success', 'checkout_success'],
      ['payment_success/1234', 'checkout_success/1234'],
      ['payment_success/PAYPAL/1234?utm_nooverride=1', 'checkout_success/1234'],
      ['payment_success/', 'checkout_success'],
      ['checkout/default', 'checkout'],
      ['checkout/foo/bar', 'checkout'],
      ['checkout_payment/foo/bar', 'checkout_payment_and_shipping/foo/bar'],
      ['checkout_payment', 'checkout_payment_and_shipping'],
      ['', 'index'],
    ];

    mappingTests.forEach((path) => {
      const liveTest = base + pathLive + path[0];
      const liveAppTest = base + pathLive + pathApp + path[0];
      const devTest = base + pathDevelopment + path[0];
      const devAppTest = base + pathDevelopment + pathApp + path[0];

      expect(sgUrlMapper(liveTest)).to.deep.equal({
        public: path[1],
        private: path[1],
      });
      expect(sgUrlMapper(liveAppTest)).to.deep.equal({
        public: path[1],
        private: path[1],
      });
      expect(sgUrlMapper(devTest)).to.deep.equal({
        public: path[1],
        private: path[1],
      });
      expect(sgUrlMapper(devAppTest)).to.deep.equal({
        public: path[1],
        private: path[1],
      });
    });
  });

  it('should test the mapping for simple use cases', () => {
    const mappingTests = [
      ['index', 'index'],
      ['checkout_success', 'checkout_success/12345'],
      ['item', 'item/5321'],
      ['items', 'items/5321/1234/134'],
      ['category', 'category/5321'],
      ['category_show_all_items', 'category_show_all_items/5321'],
    ];

    mappingTests.forEach((path) => {
      const liveTest = base + pathLive + path[1];
      const liveAppTest = base + pathLive + pathApp + path[1];
      const devTest = base + pathDevelopment + path[1];
      const devAppTest = base + pathDevelopment + pathApp + path[1];

      const expectedData = {
        public: path[1],
        private: path[0],
      };

      expect(sgUrlMapper(devTest)).to.deep.equal(expectedData);
      expect(sgUrlMapper(devAppTest)).to.deep.equal(expectedData);
      expect(sgUrlMapper(liveTest)).to.deep.equal(expectedData);
      expect(sgUrlMapper(liveAppTest)).to.deep.equal(expectedData);
    });
  });
});
