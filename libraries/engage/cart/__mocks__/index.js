export const getCurrency = jest.fn().mockReturnValue('EUR');
export const getCartItems = jest.fn().mockReturnValue([
  {
    id: '106051878',
    quantity: 2,
    type: 'product',
    product: {
      id: '2016',
      name: 'Honda Accord 2016 Sedan',
      featuredImageUrl: 'https://picsum.photos/440/440',
      price: {
        unit: 100,
        default: 200,
        special: 200,
        info: '',
      },
      properties: [
        {
          label: 'Color',
          value: 'Black',
        },
        {
          label: 'Shoe size',
          value: '5',
        },
      ],
      appliedDiscounts: [],
      additionalInfo: [],
    },
    coupon: null,
    messages: [],
    fulfillment: {
      method: 'ROPIS',
      location: { code: 'LOCATION_CODE' },
    },
  },
]);
export const getSubTotal = jest.fn().mockReturnValue(200);
export const getGrandTotal = jest.fn().mockReturnValue(200);
