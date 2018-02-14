/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const mockData = [
  {
    name: 'Product with child 9 Mother - 3 Attributes',
    productId: '1051',
    response: {
      products: [
        {
          id: '1051-1052',
          hasOptions: false,
          characteristics: {
            1: '1',
            2: '1',
            3: '1',
          },
          availability: null,
        },
        {
          id: '1051-1053',
          hasOptions: false,
          characteristics: {
            1: '1',
            2: '1',
            3: '2',
          },
          availability: null,
        },
        {
          id: '1051-1054',
          hasOptions: false,
          characteristics: {
            1: '2',
            2: '2',
            3: '2',
          },
          availability: null,
        },
        {
          id: '1051-1055',
          hasOptions: false,
          characteristics: {
            1: '2',
            2: '3',
            3: '2',
          },
          availability: null,
        },
        {
          id: '1051-1056',
          hasOptions: false,
          characteristics: {
            1: '2',
            2: '4',
            3: '2',
          },
          availability: null,
        },
        {
          id: '1051-1057',
          hasOptions: false,
          characteristics: {
            1: '3',
            2: '3',
            3: '2',
          },
          availability: null,
        },
      ],
      characteristics: [
        {
          id: '1',
          label: 'Color',
          values: [
            {
              id: '1',
              label: 'Charcoal',
            },
            {
              id: '2',
              label: 'Black',
            },
            {
              id: '3',
              label: 'Blue',
            },
          ],
        },
        {
          id: '2',
          label: 'Style',
          values: [
            {
              id: '1',
              label: 'Chain',
            },
            {
              id: '2',
              label: 'Clean',
            },
            {
              id: '3',
              label: 'Bangle',
            },
            {
              id: '4',
              label: 'Drop',
            },
          ],
        },
        {
          id: '3',
          label: 'Necklace Length',
          values: [
            {
              id: '1',
              label: '18"',
            },
            {
              id: '2',
              label: '24"',
            },
          ],
        },
      ],
    },
    initialProductId: null,
    initialState: [
      {
        disabled: false,
        id: '1',
        label: 'Color',
        selected: false,
        value: null,
        values: [
          {
            disabled: false,
            id: '1',
            label: 'Charcoal',
            selected: false,
            availability: null,
          },
          {
            disabled: false,
            id: '2',
            label: 'Black',
            selected: false,
            availability: null,
          },
          {
            disabled: false,
            id: '3',
            label: 'Blue',
            selected: false,
            availability: null,
          },
        ],
      },
      {
        disabled: true,
        id: '2',
        label: 'Style',
        selected: false,
        value: null,
        values: [
          {
            disabled: true,
            id: '1',
            label: 'Chain',
            selected: false,
            availability: null,
          },
          {
            disabled: true,
            id: '2',
            label: 'Clean',
            selected: false,
            availability: null,
          },
          {
            disabled: true,
            id: '3',
            label: 'Bangle',
            selected: false,
            availability: null,
          },
          {
            disabled: true,
            id: '4',
            label: 'Drop',
            selected: false,
            availability: null,
          },
        ],
      },
      {
        disabled: true,
        id: '3',
        label: 'Necklace Length',
        selected: false,
        value: null,
        values: [
          {
            disabled: true,
            id: '1',
            label: '18"',
            selected: false,
            availability: null,
          },
          {
            disabled: true,
            id: '2',
            label: '24"',
            selected: false,
            availability: null,
          },
        ],
      },
    ],
    updates: [
      {
        name: 'selects characteristic 1-2',
        id: '1',
        valueId: '2',
        productId: null,
        changes: [
          {
            id: '1',
            selected: true,
            value: '2',
            values: [
              {
                id: '2',
                selected: true,
                availability: null,
              },
            ],
          },
          {
            id: '2',
            disabled: false,
            values: [
              {
                id: '1',
                disabled: true,
                availability: null,
              },
              {
                id: '2',
                disabled: false,
                availability: null,
              },
              {
                id: '3',
                disabled: false,
                availability: null,
              },
              {
                id: '4',
                disabled: false,
                availability: null,
              },
            ],
          },
        ],
      },
      {
        name:
          'selects characteristic 2-3 - auto selects characteristic 3-2 (child product determined)',
        id: '2',
        valueId: '3',
        productId: '1051-1055',
        changes: [
          {
            id: '2',
            selected: true,
            value: '3',
            values: [
              {
                id: '3',
                selected: true,
                availability: null,
              },
            ],
          },
          {
            id: '3',
            disabled: false,
            selected: true,
            value: '2',
            values: [
              {
                id: '2',
                disabled: false,
                selected: true,
                availability: null,
              },
            ],
          },
        ],
      },
      {
        name:
          'selects characteristic 2-4 - auto selects characteristic 3-2 (child product determined)',
        id: '2',
        valueId: '4',
        productId: '1051-1056',
        changes: [
          {
            id: '2',
            selected: true,
            value: '4',
            values: [
              {
                id: '3',
                selected: false,
                availability: null,
              },
              {
                id: '4',
                selected: true,
                availability: null,
              },
            ],
          },
        ],
      },
      {
        name: 'tries to select characteristic 2-1 (disabled) - no changes',
        id: '2',
        valueId: '1',
        productId: '1051-1056',
        changes: [],
      },
      {
        name:
          'selects characteristic 1-3 - auto selects characteristic 2-3 and characteristic 3-2 (child product determined)',
        id: '1',
        valueId: '3',
        productId: '1051-1057',
        changes: [
          {
            id: '1',
            value: '3',
            values: [
              {
                id: '2',
                selected: false,
                availability: null,
              },
              {
                id: '3',
                selected: true,
                availability: null,
              },
            ],
          },
          {
            id: '2',
            value: '3',
            values: [
              {
                id: '1',
                disabled: true,
                availability: null,
              },
              {
                id: '2',
                disabled: true,
                availability: null,
              },
              {
                id: '3',
                selected: true,
                availability: null,
              },
              {
                id: '4',
                disabled: true,
                selected: false,
                availability: null,
              },
            ],
          },
        ],
      },
      {
        name:
          'selects characteristic 1-1 - auto selects characteristic 2-1 (reset product selection)',
        id: '1',
        valueId: '1',
        productId: null,
        changes: [
          {
            id: '1',
            value: '1',
            values: [
              {
                id: '1',
                selected: true,
                availability: null,
              },
              {
                id: '3',
                selected: false,
                availability: null,
              },
            ],
          },
          {
            id: '2',
            value: '1',
            values: [
              {
                id: '1',
                disabled: false,
                selected: true,
                availability: null,
              },
              {
                id: '2',
                disabled: true,
                availability: null,
              },
              {
                id: '3',
                disabled: true,
                selected: false,
                availability: null,
              },
              {
                id: '4',
                disabled: true,
                availability: null,
              },
            ],
          },
          {
            id: '3',
            selected: false,
            value: null,
            values: [
              {
                id: '1',
                disabled: false,
                availability: null,
              },
              {
                id: '2',
                selected: false,
                availability: null,
              },
            ],
          },
        ],
      },
      {
        name: 'selects characteristic 3-1 (child product determined)',
        id: '3',
        valueId: '1',
        productId: '1051-1052',
        changes: [
          {
            id: '3',
            value: '1',
            selected: true,
            values: [
              {
                id: '1',
                selected: true,
                availability: null,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default mockData;
