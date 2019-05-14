import { getProductPriceData } from '@shopgate/pwa-common-commerce/product';
import { getProductMapPrice } from './price';

jest.mock('@shopgate/pwa-common-commerce/product', () => ({
  getProductPriceData: jest.fn(),
}));

describe('Engage.product selectors', () => {
  beforeAll(jest.resetAllMocks);

  describe('getProductMapPrice', () => {
    it('Should return null for not found product', () => {
      getProductPriceData.mockReturnValue(null);
      expect(getProductMapPrice({}, {})).toBeNull();
    });
    it('Should return null for map price', () => {
      getProductPriceData.mockReturnValue({ id: 'SG10' });
      expect(getProductMapPrice({}, {})).toBeNull();
    });
    it('Should return map price', () => {
      getProductPriceData.mockReturnValue({
        mapPricing: {
          startDate: '2019-04-01T10:00:00.000Z',
          endDate: '2019-04-10T10:00:00.000Z',
          price: 10,
        },
      });
      expect(getProductMapPrice({}, {})).toEqual({
        startDate: '2019-04-01T10:00:00.000Z',
        endDate: '2019-04-10T10:00:00.000Z',
        price: 10,
      });
    });
  });
});
