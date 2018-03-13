/* eslint global-require: "off" */
/* eslint-disable no-unused-expressions */
import chai from 'chai';
import sinonChai from 'sinon-chai';
import mochaJsdom from 'mocha-jsdom';
import storageMock from './helpers/localStorage-mock';
import { sgDataProduct, sgDataSearch, sgDataCategoryAll } from './data/tracking.testData';

const expect = chai.expect;

chai.use(sinonChai);

describe('Base', () => {
  let SgTrackingPlugin;
  mochaJsdom();

  before(() => {
    global.localStorage = storageMock();
    window.SGEvent = {};

    SgTrackingPlugin = require('../plugins/Base').default;
  });

  const testProduct = {
    uid: '123',
    name: 'testproduct',
    quantity: 2,
    amount: {
      net: '100.00',
      gross: '110.55',
      currency: 'EUR',
    },
  };

  const expectedProduct = {
    id: testProduct.uid,
    name: testProduct.name,
    type: 'product',
    priceNet: parseFloat(testProduct.amount.net),
    priceGross: parseFloat(testProduct.amount.gross),
    quantity: testProduct.quantity,
    currency: testProduct.amount.currency,
  };

  it('should disable and enable the tracking', () => {
    const plugin = new SgTrackingPlugin();

    expect(plugin.trackingDisabled).to.be.false;
    plugin.disableTracking();
    expect(plugin.trackingDisabled).to.be.true;
    plugin.enableTracking();
    expect(plugin.trackingDisabled).to.be.false;
  });

  describe('format event data', () => {
    it('should format custom event data', () => {
      const expectedData = {
        eventCategory: '',
        eventAction: '',
        eventLabel: null,
        eventValue: null,
        nonInteraction: false,
      };

      const formattedData = SgTrackingPlugin.formatData('smartbanner');
      expect(formattedData).to.deep.equal(expectedData);
    });

    it('should format pageview event data', () => {
      const expectedData = {
        page: {
          merchantUrl: 'item/1234',
          shopgateUrl: 'item',
        },
      };

      const formattedData = SgTrackingPlugin.formatData('pageview', { page: { link: 'http://m.atu.de/item/1234' } });
      expect(formattedData).to.deep.equal(expectedData);
    });

    it('should format addToCart event data', () => {
      const inputData = {
        products: [testProduct],
      };

      const expectedData = {
        type: 'product',
        items: [expectedProduct],
      };

      const formattedData = SgTrackingPlugin.formatData('addToCart', inputData);
      expect(formattedData).to.deep.equal(expectedData);
    });

    it('should format addToWishlist event data', () => {
      const inputData = {
        favouriteListProducts: [{
          ...testProduct,
          currency_id: 'EUR',
          unit_amount_net: (testProduct.amount.net * 100).toString(),
          unit_amount_with_tax: (testProduct.amount.gross * 100).toString(),
        }],
      };

      const expected = { ...expectedProduct };
      delete expected.quantity;

      const expectedData = {
        type: 'product',
        items: [expected],
      };

      const formattedData = SgTrackingPlugin.formatData('addToWishlist', inputData);
      expect(formattedData).to.deep.equal(expectedData);
    });

    it('should format initiatedCheckout event data', () => {
      const inputData = {
        checkoutType: 'express',
        product: {
          amount: {
            net: '100.00',
            gross: '110.50',
            currency: 'EUR',
          },
        },
        quantity: 16,
      };

      const expectedData = {
        type: inputData.checkoutType,
        valueNet: parseFloat(inputData.product.amount.net),
        valueGross: parseFloat(inputData.product.amount.gross),
        numItems: inputData.quantity,
        currency: inputData.product.amount.currency,
        paymentInfoAvailable: inputData.checkoutType !== 'default',
      };

      const formattedData = SgTrackingPlugin.formatData('initiatedCheckout', inputData);
      expect(formattedData).to.deep.equal(expectedData);
    });

    it('should format completedRegistration event data', () => {
      const inputData = {
        registrationType: 'guest',
      };
      const expectedData = {
        registrationMethod: inputData.registrationType,
      };

      const formattedData = SgTrackingPlugin.formatData('completedRegistration', inputData);
      expect(formattedData).to.deep.equal(expectedData);
    });

    it('should format addedPaymentInfo event data', () => {
      const inputData = {
        paymentMethodAdded: {
          success: true,
          name: 'credit card',
        },
      };
      const formattedData = SgTrackingPlugin.formatData('addedPaymentInfo', inputData);
      expect(formattedData).to.deep.equal(inputData.paymentMethodAdded);
    });

    it('should format search event data', () => {
      const inputData = {
        search: {
          resultCount: 356,
          query: 'black shoes',
        },
      };
      const expectedData = {
        type: 'product',
        query: inputData.search.query,
        hits: inputData.search.resultCount,
        success: !!inputData.search.resultCount,
      };

      const formattedData = SgTrackingPlugin.formatData('search', inputData);
      expect(formattedData).to.deep.equal(expectedData);
    });

    it('should format viewContent event data', () => {
      // Product page
      const inputData = { ...sgDataProduct };

      const expectedData = {
        id: sgDataProduct.product.productNumber,
        name: sgDataProduct.product.name,
        type: 'product',
      };

      let formattedData = SgTrackingPlugin.formatData('viewContent', inputData);
      expect(formattedData).to.deep.equal(expectedData);

      inputData.page.link = `https://rapid.shopgate.com/sg_app_resources/10006/item/${sgDataProduct.product.productNumber}`;

      formattedData = SgTrackingPlugin.formatData('viewContent', inputData);
      expect(formattedData).to.deep.equal(expectedData);

      // Category all
      formattedData = SgTrackingPlugin.formatData('viewContent', sgDataCategoryAll);
      expect(formattedData).to.deep.equal({
        id: `${sgDataCategoryAll.category.uid}/all`,
        name: sgDataCategoryAll.category.name,
        type: 'category',
      });

      // Search
      formattedData = SgTrackingPlugin.formatData('viewContent', sgDataSearch);
      expect(formattedData).to.deep.equal({
        id: sgDataSearch.search.query,
        name: sgDataSearch.page.title.substring(0, sgDataSearch.page.title.indexOf(':')).trim(),
        type: sgDataSearch.page.name,
      });

      // Reviews
      formattedData = SgTrackingPlugin.formatData('viewContent', {
        page: {
          referrer: 'http://testshop.schneider.localdev.cc/php/shopgate/item/5347313134',
          name: 'reviews',
          link: 'http://testshop.schneider.localdev.cc/php/shopgate/reviews/5347313134',
          title: 'Rezensionen - Produkt mit vielen Bewertungen - Offizieller Shopgate Testshop',
        },
      });
      expect(formattedData).to.deep.equal({
        id: 'SG114',
        name: 'Rezensionen - Produkt mit vielen Bewertungen - Offizieller Shopgate Testshop',
        type: 'reviews',
      });

      // Payment_success
      formattedData = SgTrackingPlugin.formatData('viewContent', {
        page: {
          referrer: '',
          name: 'success',
          link: 'http://testshop.schneider.localdev.cc/php/shopgate/payment_success/5347313134',
          title: 'Checkout success',
        },
      });
      expect(formattedData).to.deep.equal({
        id: '5347313134',
        name: 'Checkout success',
        type: 'checkout_success',
      });
    });

    it('should format purchase event data', () => {
      const inputData = {
        order: {
          number: '123',
          amount: {
            gross: '10.00',
            net: '11.05',
            tax: '6.50',
            currency: 'EUR',
          },
          shipping: {
            amount: {
              gross: '1.00',
              net: '0.87',
            },
          },
          products: [testProduct],
        },
        shop: {
          name: 'testshop',
        },
      };

      const expectedData = {
        id: inputData.order.number,
        type: 'product',
        affiliation: inputData.shop.name,
        revenueGross: parseFloat(inputData.order.amount.gross),
        revenueNet: parseFloat(inputData.order.amount.net),
        tax: parseFloat(inputData.order.amount.tax),
        shippingGross: parseFloat(inputData.order.shipping.amount.gross),
        shippingNet: parseFloat(inputData.order.shipping.amount.net),
        currency: inputData.order.amount.currency,
        items: [expectedProduct],
      };

      const formattedData = SgTrackingPlugin.formatData('purchase', inputData);
      expect(formattedData).to.deep.equal(expectedData);
    });
  });
});
/* eslint-enable no-unused-expressions */
