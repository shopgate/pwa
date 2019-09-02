import helpers from './formatHelpers';

const { itemView, selectedPaymentInfo } = helpers;

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

describe('Format helpers', () => {
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
