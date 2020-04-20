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
  router: {
    routing: false,
    stack: [
      {
        id: '82588781-089a-46bc-8174-7cebfae12d95',
        params: {},
        pathname: '/',
        pattern: '/',
        query: {},
        state: {},
      },
      {
        id: '834a9c2f-c94d-441d-aba5-446a7895d724',
        params: {},
        pathname: '/cart',
        pattern: '/cart',
        query: {},
        state: {
          title: 'Shopping cart',
        },
      },
    ],
  },
};

const products = [
  {
    id: '123',
    quantity: 1,
    type: 'product',
    product: {
      id: 'test_product',
      name: 'Test Product',
      featuredImageBaseUrl: 'https://img-cdn.shopgate.com/30794/1/d11b2e01b66f7a505fbd98b6ed7463c092aeaebae11ee8bec20ffc13344297fa',
      featuredImageUrl: 'https://img-cdn.shopgate.com/30794/1/d11b2e01b66f7a505fbd98b6ed7463c092aeaebae11ee8bec20ffc13344297fa',
      price: {
        unit: 20,
        default: 20,
        special: null,
      },
      properties: [
        {
          label: 'Weight',
          value: '15kg',
        },
      ],
      appliedDiscounts: [],
    },
    coupon: null,
    messages: [],
  },
];

const coupon = {
  id: '234',
  quantity: 1,
  type: 'coupon',
  coupon: {
    code: 'FOREVER',
    description: null,
    label: 'Coupon',
    savedPrice: {
      value: 5,
      type: 'fixed',
    },
  },

  messages: [],
  product: null,
};

const cartState = {
  ...emptyState,
  ...{
    cart: {
      ...emptyState.cart,
      items: products,
    },
  },
};

const couponState = {
  ...emptyState,
  ...{
    cart: {
      ...emptyState.cart,
      items: [
        ...products,
        { ...coupon },
      ],
    },
  },
};
const uiState = {
  ui: {
    general: {},
  },
};

export {
  uiState,
  emptyState,
  cartState,
  couponState,
};
