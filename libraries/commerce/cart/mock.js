const emptyState = {
  cart: {
    items: [],
    totals: [
      {
        label: null,
        amount: 0,
        type: 'subTotal',
      },
      {
        label: null,
        amount: 0,
        type: 'grandTotal',
      },
    ],
    productPendingCount: 0,
    flags: {
      orderable: true,
      taxIncluded: false,
      coupons: true,
    },
    isFetching: false,
    expires: 0,
    isOrderable: true,
    isTaxIncluded: false,
    currency: 'USD',
    messages: [],
    text: {
      legalText: 'By placing your order you agree to our <b><u>Privacy Policy</u></b> and our <b><u>Terms and Conditions</u></b>.',
      legalInfo: '',
    },
  },
  view: {
    isLoading: false,
  },
  client: {
    device: {
      locale: 'de',
      model: 'Redmi Note 4',
      os: {
        apiLevel: '23',
        platform: 'android',
        ver: '6.0',
      },
      type: 'phone',
    },
  },
};

const items = [
  { id: 'foo' },
];

const cartState = {
  ...emptyState,
  ...{
    cart: {
      ...emptyState.cart,
      items,
    },
  },
};

export {
  emptyState,
  cartState,
};
