const gaOrderData = {
  universal: {
    order: {
      affiliation: 'Offizieller Shopgate Testshop',
      currency: 'EUR',
      id: '1700001978',
      revenue: 303.36,
      shipping: 10,
      tax: -0,
    },
    items: [
      {
        id: '1700001978',
        name: 'Produkt mit einem Grundpreis – langer Text',
        price: 75.63,
        quantity: 1,
        sku: 'item_number_public-10',
      },
      {
        id: '1700001978',
        name: 'Produkt als Highlight 2',
        price: 227.73,
        quantity: 1,
        sku: 'item_number_public-38',
      },
    ],
  },
  classic: {
    order: [
      '1700001978',
      'Offizieller Shopgate Testshop',
      303.36,
      -0,
      10,
      'Butzbach',
      '',
      undefined,
    ],
    items: [
      [
        '1700001978',
        'item_number_public-10',
        'Produkt mit einem Grundpreis – langer Text',
        '',
        75.63,
        1,
      ],
      [
        '1700001978',
        'item_number_public-38',
        'Produkt als Highlight 2',
        '',
        227.73,
        1,
      ],
    ],
  },
};

export { gaOrderData };
