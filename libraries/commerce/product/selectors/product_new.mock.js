export const mockedProductsById = {
  // Base product with variants
  product_1: {
    isFetching: false,
    productData: {
      id: 'product_1',
      baseProductId: null,
      flags: {
        hasChildren: false,
        hasOptions: false,
        hasVariants: true,
      },
      stock: {
        ignoreQuantity: false,
        quantity: 0,
        info: 'Out of stock',
        orderable: false,
        minOrderQuantity: 1,
        maxOrderQuantity: 10000,
      },
    },
  },
  // Variant product of product_1
  product_2: {
    isFetching: false,
    productData: {
      id: 'product_2',
      baseProductId: 'product_1',
      flags: {
        hasChildren: false,
        hasOptions: false,
        hasVariants: false,
      },
      stock: {
        ignoreQuantity: true,
        quantity: 200,
        info: 'In stock',
        orderable: true,
        minOrderQuantity: 1,
        maxOrderQuantity: 10000,
      },
    },
  },
  // Variant product of product_1 which is not ordeable
  product_3: {
    isFetching: false,
    productData: {
      id: 'product_3',
      baseProductId: 'product_1',
      flags: {
        hasChildren: false,
        hasOptions: false,
        hasVariants: false,
      },
      stock: {
        ignoreQuantity: false,
        quantity: 0,
        info: 'Out of stock',
        orderable: false,
        minOrderQuantity: 1,
        maxOrderQuantity: 10000,
      },
    },
  },
  // Currently fetching product
  product_4: {
    isFetching: true,
    productData: null,
  },
  // Simple product without variants
  product_5: {
    isFetching: false,
    productData: {
      id: 'product_4',
      baseProductId: null,
      flags: {
        hasChildren: false,
        hasOptions: false,
        hasVariants: false,
      },
      name: 'Fancy Product',
      manufacturer: 'ACME',
      price: {
        currency: 'EUR',
        info: '',
        unitPrice: 90,
        unitPriceStriked: 95,
        unitPriceMin: 0,
        unitPriceMax: 0,
        unitPriceNet: 150,
        unitPriceWithTax: 150,
        taxAmount: 0,
        taxPercent: 0,
        msrp: 100,
        tiers: [],
        discount: 10,
      },
      rating: {
        count: 2,
        average: 50,
        reviewCount: 2,
      },
      stock: {
        ignoreQuantity: true,
        quantity: 200,
        info: 'In stock',
        orderable: true,
        minOrderQuantity: 1,
        maxOrderQuantity: 10000,
      },
      availability: {
        text: 'In stock',
        state: 'ok',
      },
      metadata: {
        some: 'metadata',
      },
    },
  },
};

export const mockedShippingByProductId = {
  product_1: {
    isFetching: false,
    shipping: {
      currency: 'EUR',
      price: 499,
    },
  },
  product_5: {
    isFetching: true,
  },
};

export const mockedDescriptionsByProductId = {
  product_1: {
    isFetching: false,
    description: 'Lorem ipsum dolor',
  },
  product_5: {
    isFetching: true,
  },
};

export const mockedProperty1 = {
  label: 'Article No.',
  value: '9252529931',
};
export const mockedProperty2 = {
  label: 'Manufacturer',
  value: 'Nike',
};

export const mockedPropertiesByProductId = {
  product_1: {
    isFetching: false,
    properties: [
      mockedProperty1,
      mockedProperty2,
    ],
  },
  product_5: {
    isFetching: true,
  },
};

export const mockedProductImagesBase = [
  'https://img-cdn.shopgate.com/a43fac2d',
  'https://img-cdn.shopgate.com/b543f421',
];

export const mockedProductImagesVariant = [
  'https://img-cdn.shopgate.com/a43fac2d',
  'https://img-cdn.shopgate.com/b543f421',
];

export const mockedImagesByProductId = {
  product_1: {
    isFetching: false,
    images: mockedProductImagesBase,
  },
  product_2: {
    isFetching: false,
    images: mockedProductImagesVariant,
  },
  product_3: {
    isFetching: false,
    images: [],
  },
  product_5: {
    isFetching: true,
  },
};

export const mockedVariantsByProductId = {
  product_1: {
    isFetching: false,
    variants: {
      products: [
        {
          id: 'product_2',
          characteristics: { 1: '1' },
          availability: {
            text: 'In stock',
            state: 'ok',
          },
        },
        {
          id: 'product_3',
          characteristics: { 1: '2' },
          availability: {
            text: 'Only 3 items left',
            state: 'warning',
          },
        },
      ],
      characteristics: [
        {
          id: '1',
          label: 'Color',
          values: [
            {
              id: '1',
              label: 'Black',
            },
            {
              id: '2',
              label: 'Green',
            },
          ],
        },
      ],
    },
  },
};

export const mockedProductState = {
  product: {
    productsById: mockedProductsById,
    shippingByProductId: mockedShippingByProductId,
    descriptionsByProductId: mockedDescriptionsByProductId,
    propertiesByProductId: mockedPropertiesByProductId,
    imagesByProductId: mockedImagesByProductId,
    variantsByProductId: mockedVariantsByProductId,
  },
};
