import { sgDataProduct, sgDataSearch, sgDataCategoryAll } from '../tests/data/tracking.testData';
import helpers from './formatHelpers';

const {
  smartbanner,
  purchase,
  pageview,
  viewContent,
  addToCart,
  addToWishlist,
  initiatedCheckout,
  completedRegistration,
  search,
  addedPaymentInfo,
  selectedPaymentInfo,
  itemView,
} = helpers;

const mockBaseProduct = {
  uid: 'base-product',
  name: 'Product name',
  manufacturer: 'Product manufacturer',
  quantity: 3,
  tags: [],
  amount: {
    currency: 'EUR',
    gross: '100.99',
    net: '90.99',
    striked: '0.00',
  },
};

const mockMockVariantProduct = {
  ...mockBaseProduct,
  uid: 'variant-product',
};

const expectedProduct = {
  id: mockBaseProduct.uid,
  name: mockBaseProduct.name,
  brand: mockBaseProduct.manufacturer,
  type: 'product',
  priceNet: parseFloat(mockBaseProduct.amount.net),
  priceGross: parseFloat(mockBaseProduct.amount.gross),
  quantity: mockBaseProduct.quantity,
  currency: mockBaseProduct.amount.currency,
};

describe('Format helpers', () => {
  describe('custom events', () => {
    it('should format event data for the smartbanner event', () => {
      const raw = {
        eventCategory: '',
        eventAction: '',
        eventLabel: null,
        eventValue: null,
        nonInteraction: false,
      };

      expect(smartbanner(raw)).toEqual(raw);
    });
  });
  describe('purchase()', () => {
    it('should format event data', () => {
      const raw = {
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
          products: [mockBaseProduct],
        },
        shop: {
          name: 'testshop',
        },
      };

      expect(purchase(raw)).toEqual({
        id: raw.order.number,
        type: 'product',
        affiliation: raw.shop.name,
        revenueGross: parseFloat(raw.order.amount.gross),
        revenueNet: parseFloat(raw.order.amount.net),
        tax: parseFloat(raw.order.amount.tax),
        shippingGross: parseFloat(raw.order.shipping.amount.gross),
        shippingNet: parseFloat(raw.order.shipping.amount.net),
        currency: raw.order.amount.currency,
        items: [expectedProduct],
      });
    });
  });

  describe('pageview()', () => {
    it('should format event data', () => {
      const raw = {
        page: { link: 'http://m.atu.de/item/1234' },
      };

      expect(pageview(raw)).toEqual({
        page: {
          merchantUrl: 'item/1234',
          shopgateUrl: 'item',
        },
      });
    });
  });

  describe('viewContent()', () => {
    it('should format event data for an item route', () => {
      const raw = { ...sgDataProduct };
      const expected = {
        id: sgDataProduct.product.productNumber,
        name: sgDataProduct.product.name,
        type: 'product',
      };

      expect(viewContent(raw)).toEqual(expected);
      raw.page.link = `https://rapid.shopgate.com/sg_app_resources/10006/item/${sgDataProduct.product.productNumber}`;
      expect(viewContent(raw)).toEqual(expected);
    });

    it('should format event data for an category/all route', () => {
      expect(viewContent(sgDataCategoryAll)).toEqual({
        id: `${sgDataCategoryAll.category.uid}/all`,
        name: sgDataCategoryAll.category.name,
        type: 'category',
      });
    });

    it('should format event data for a search route', () => {
      expect(viewContent(sgDataSearch)).toEqual({
        id: sgDataSearch.search.query,
        name: sgDataSearch.page.title.substring(0, sgDataSearch.page.title.indexOf(':')).trim(),
        type: sgDataSearch.page.name,
      });
    });

    it('should format event data for a reviews route', () => {
      const raw = {
        page: {
          referrer: 'http://testshop.schneider.localdev.cc/php/shopgate/item/5347313134',
          name: 'reviews',
          link: 'http://testshop.schneider.localdev.cc/php/shopgate/reviews/5347313134',
          title: 'Reviews - Product with manufacturer - Shopgate Testshop',
        },
      };

      expect(viewContent(raw)).toEqual({
        id: 'SG114',
        name: 'Reviews - Product with manufacturer - Shopgate Testshop',
        type: 'reviews',
      });
    });

    it('should format event data for a payment_success route', () => {
      const raw = {
        page: {
          referrer: '',
          name: 'success',
          link: 'http://testshop.schneider.localdev.cc/php/shopgate/payment_success/5347313134',
          title: 'Checkout success',
        },
      };
      expect(viewContent(raw)).toEqual({
        id: '5347313134',
        name: 'Checkout success',
        type: 'checkout_success',
      });
    });
  });

  describe('addToCart', () => {
    it('should format event data', () => {
      const raw = {
        products: [mockBaseProduct],
      };

      expect(addToCart(raw)).toEqual({
        type: 'product',
        items: [expectedProduct],
      });
    });
  });

  describe('addToWishlist()', () => {
    it('should format event data', () => {
      /* eslint-disable camelcase */
      const raw = {
        favouriteListProducts: [{
          ...mockBaseProduct,
          currency_id: 'EUR',
          unit_amount_net: (mockBaseProduct.amount.net * 100).toString(),
          unit_amount_with_tax: (mockBaseProduct.amount.gross * 100).toString(),
        }],
      };
      /* eslint-enable camelcase */

      const { quantity, brand, ...expectedItems } = expectedProduct;

      expect(addToWishlist(raw)).toEqual({
        type: 'product',
        items: [expectedItems],
      });
    });
  });

  describe('initiatedCheckout()', () => {
    it('should format event data', () => {
      const raw = {
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

      expect(initiatedCheckout(raw)).toEqual({
        type: raw.checkoutType,
        valueNet: parseFloat(raw.product.amount.net),
        valueGross: parseFloat(raw.product.amount.gross),
        numItems: raw.quantity,
        currency: raw.product.amount.currency,
        paymentInfoAvailable: raw.checkoutType !== 'default',
      });
    });
  });

  describe('completedRegistration()', () => {
    it('should format event data', () => {
      const raw = {
        registrationType: 'guest',
      };

      expect(completedRegistration(raw)).toEqual({
        registrationMethod: raw.registrationType,
      });
    });
  });

  describe('search()', () => {
    it('should format event data', () => {
      const raw = {
        search: {
          resultCount: 356,
          query: 'black shoes',
        },
      };

      expect(search(raw)).toEqual({
        type: 'product',
        query: raw.search.query,
        hits: raw.search.resultCount,
        success: !!raw.search.resultCount,
      });
    });
  });

  describe('itemView()', () => {
    it('should format raw base product data', () => {
      const raw = {
        product: mockBaseProduct,
      };

      expect(itemView(raw)).toEqual({
        id: 'base-product',
        type: '',
        name: 'Product name',
        priceNet: 90.99,
        priceGross: 100.99,
        currency: 'EUR',
        brand: 'Product manufacturer',
      });
    });

    it('should format raw variant product data', () => {
      const raw = {
        baseProduct: mockBaseProduct,
        variant: mockMockVariantProduct,
      };

      expect(itemView(raw)).toEqual({
        id: 'variant-product',
        type: '',
        name: 'Product name',
        priceNet: 90.99,
        priceGross: 100.99,
        currency: 'EUR',
        brand: 'Product manufacturer',
      });
    });
  });

  describe('addedPaymentInfo()', () => {
    it('should format event data', () => {
      const raw = {
        paymentMethodAdded: {
          success: true,
          name: 'credit card',
        },
      };
      expect(addedPaymentInfo(raw)).toEqual({
        success: raw.paymentMethodAdded.success,
        name: raw.paymentMethodAdded.name,
      });
    });
  });

  describe('selectedPaymentInfo()', () => {
    it('should format tracking data', () => {
      const raw = {
        paymentMethodSelected: {
          success: true,
          name: 'Payment method',
        },
      };
      expect(selectedPaymentInfo(raw)).toEqual({
        success: raw.paymentMethodSelected.success,
        name: raw.paymentMethodSelected.name,
      });
    });
  });
});
