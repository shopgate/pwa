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

const items = [
  {
    id: 'foo',
    type: 'product',
    quantity: 1,
    currency: 'USD',
    product: {
      name: 'The Lego Movie Mens T-Shirt - "Taco Tuesdays!" 3 Lego Amigos Image',
      active: true,
      stock: {
        ignoreQuantity: true,
        quantity: 0,
        orderable: true,
      },
      flags: {
        hasChildren: false,
        hasVariants: true,
        hasOptions: false,
      },
      baseProductId: null,
      featuredImageUrl: 'https://img-cdn.shopgate.com/30794/1/3e722e1d8acd348dfa33132777be7b8ef96cdcb50671b8b0c853df4950a2e91d',
      type: 'parent',
      price: {
        currency: 'USD',
        unitPrice: 12.5,
        unitPriceNet: 12.5,
      },
    },
  },
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
