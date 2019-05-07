import cloneDeep from 'lodash/cloneDeep';

export const mockedRouterState = {
  currentRoute: null,
  stack: [],
};

export const mockedProductMetadata = { some: 'product metadata' };
export const mockedVariantProductMetadata = { some: 'variant product metadata' };
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
      metadata: mockedProductMetadata,
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
      metadata: mockedVariantProductMetadata,
    },
  },
  // Variant product of product_1 which is not orderable
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
      id: 'product_5',
      baseProductId: null,
      flags: {
        hasChildren: false,
        hasOptions: false,
        hasVariants: false,
      },
      name: 'Fancy Product',
      longName: 'Fancy Long Product Name',
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
  product_7: {
    isFetching: false,
    productData: {
      name: 'Short product name',
    },
  },
  // Taken from the original getKnownRelatives() selector test for variants.
  parent: {
    productData: {
      id: 'parent',
      baseProductId: null,
      flags: {
        hasVariants: true,
      },
    },
  },
  child: {
    productData: {
      id: 'child',
      baseProductId: 'parent',
      flags: {
        hasVariants: false,
      },
    },
  },
  child2: {
    productData: {
      id: 'child2',
      baseProductId: 'parent',
      flags: {
        hasVariants: false,
      },
    },
  },
  notAChild: {
    productData: {
      id: 'notAChild',
      baseProductId: 'foo',
      flags: {
        hasVariants: false,
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
    properties: [mockedProperty1, mockedProperty2],
  },
  product_5: {
    isFetching: true,
  },
};

export const mockedProductImagesBase = [
  {
    width: 440,
    height: 440,
    sources: [
      'https://img-cdn.shopgate.com/a43fac2dx440',
      'https://img-cdn.shopgate.com/b543f421x440',
    ],
  },
  {
    width: 1024,
    height: 1024,
    sources: [
      'https://img-cdn.shopgate.com/a43fac2dx1024',
      'https://img-cdn.shopgate.com/b543f421x1024',
    ],
  },
];

export const mockedProductImagesVariant = [
  {
    width: 440,
    height: 440,
    sources: [
      'https://img-cdn.shopgate.com/variant-a43fac2dx440',
      'https://img-cdn.shopgate.com/variant-b543f421x440',
    ],
  },
  {
    width: 1024,
    height: 1024,
    sources: [
      'https://img-cdn.shopgate.com/variant-a43fac2dx1024',
      'https://img-cdn.shopgate.com/variant-b543f421x1024',
    ],
  },
];

export const mockedProductImagesVariantWithoutSources = [
  {
    width: 440,
    height: 440,
    sources: [],
  },
  {
    width: 1024,
    height: 1024,
    sources: [],
  },
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
    images: mockedProductImagesVariantWithoutSources,
  },
  product_5: {
    isFetching: true,
  },
};

export const mockedVariantMetadata = { some: 'variant metadata' };

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
          metadata: mockedVariantMetadata,
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

export const mockedState = {
  router: mockedRouterState,
  product: {
    productsById: mockedProductsById,
    shippingByProductId: mockedShippingByProductId,
    descriptionsByProductId: mockedDescriptionsByProductId,
    propertiesByProductId: mockedPropertiesByProductId,
    imagesByProductId: mockedImagesByProductId,
    variantsByProductId: mockedVariantsByProductId,
    optionsByProductId: {},
  },
};

/**
 * The following mocked states can be used simplified product variant testing. They mimic the
 * product state in different stages of product data fetching.
 * product_1 is the base product of product_2 and product_2.
 */

// Base product and all its variants are available.
export const mockedVariantStateComplete = {
  product: {
    productsById: {
      product_1: cloneDeep(mockedState.product.productsById.product_1),
      product_2: cloneDeep(mockedState.product.productsById.product_2),
      product_3: cloneDeep(mockedState.product.productsById.product_3),
    },
    variantsByProductId: mockedVariantsByProductId,
  },
};

// Everything is fetching.
export const mockedVariantStateAllFetching = cloneDeep(mockedVariantStateComplete);
delete mockedVariantStateAllFetching.product.variantsByProductId.product_1;
delete mockedVariantStateAllFetching.product.productsById.product_1;
delete mockedVariantStateAllFetching.product.productsById.product_2;
delete mockedVariantStateAllFetching.product.productsById.product_3;

// Base product is available, but variants data and variants ara fetching.
export const mockedVariantStateVariantDataFetching = cloneDeep(mockedVariantStateComplete);
delete mockedVariantStateVariantDataFetching.product.variantsByProductId.product_1;
delete mockedVariantStateVariantDataFetching.product.productsById.product_2;
delete mockedVariantStateVariantDataFetching.product.productsById.product_3;

// Base product and variants data is available, but variants ara fetching.
export const mockedVariantStateVariantsFetching = cloneDeep(mockedVariantStateComplete);
delete mockedVariantStateVariantsFetching.product.productsById.product_2;
delete mockedVariantStateVariantsFetching.product.productsById.product_3;
