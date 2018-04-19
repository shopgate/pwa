const mockedState = {
  filter: {
    activeFilters: [
      {
        filters: {},
        categoryId: 'men',
      },
    ],
    availableFilters: {
      '{"categoryId":"men","filters":{},"pipeline":"shopgate.catalog.getFilters"}': {
        filters: [
          {
            id: 'display_amount',
            label: 'Price',
            type: 'range',
            minimum: 1250,
            maximum: 3499,
            url: '/filter/display-amount',
          },
          {
            id: 'manufacturer',
            label: 'Brand',
            type: 'multiselect',
            source: 'manufacturer',
            values: [
              {
                id: 'Acme',
                label: 'Acme',
                hits: 1,
              },
              {
                id: 'Material Fashion',
                label: 'Material Fashion',
                hits: 3,
              },
            ],
            url: '/filter/manufacturer',
          },
          {
            id: 'Color',
            label: 'Color',
            type: 'multiselect',
            source: 'attributes',
            values: [
              {
                id: 'Blue',
                label: 'Blue',
                hits: 1,
              },
              {
                id: 'Green',
                label: 'Green',
                hits: 1,
              },
              {
                id: 'Red',
                label: 'Red',
                hits: 1,
              },
            ],
            url: '/filter/color',
          },
          {
            id: 'Length',
            label: 'Length',
            type: 'multiselect',
            source: 'attributes',
            values: [
              {
                id: '60',
                label: '60',
                hits: 1
              },
              {
                id: '80',
                label: '80',
                hits: 1,
              },
            ],
            url: '/filter/length',
          },
          {
            id: 'Size',
            label: 'Size',
            type: 'multiselect',
            source: 'attributes',
            values: [
              {
                id: '2X-Large',
                label: '2X-Large',
                hits: 1,
              },
              {
                id: '3X-Large',
                label: '3X-Large',
                hits: 1,
              },
              {
                id: 'Large',
                label: 'Large',
                hits: 1,
              },
              {
                id: 'Medium',
                label: 'Medium',
                hits: 1,
              },
              {
                id: 'Small',
                label: 'Small',
                hits: 1,
              },
              {
                id: 'X-Large',
                label: 'X-Large',
                hits: 1,
              },
              {
                id: 'X-Small',
                label: 'X-Small',
                hits: 1,
              },
            ],
            url: '/filter/size'
          },
          {
            id: 'Title',
            label: 'Title',
            type: 'multiselect',
            source: 'attributes',
            values: [
              {
                id: 'Lithograph - Height: 9" x Width: 12"',
                label: 'Lithograph - Height: 9" x Width: 12"',
                hits: 1,
              },
              {
                id: 'Medium',
                label: 'Medium',
                hits: 1,
              },
              {
                id: 'Small',
                label: 'Small',
                hits: 1
              },
            ],
            url: '/filter/title',
          },
          {
            id: 'Width',
            label: 'Width',
            type: 'multiselect',
            source: 'attributes',
            values: [
              {
                id: '20',
                label: '20',
                hits: 1,
              },
              {
                id: '40',
                label: '40',
                hits: 1,
              },
            ],
            url: '/filter/width',
          },
        ],
        isFetching: false,
        expires: 1524061454824,
      },
    },
    activeHash: '{"categoryId":"men","filters":{},"pipeline":"shopgate.catalog.getFilters"}',
    temporaryFilters: {},
  },
  history: {
    action: 'PUSH',
    pathname: '/filter',
    queryParams: {},
    length: 2,
    redirectLocation: null,
  },
};

const mockedEmpty = {
  ...mockedState,
  ...{
    filter: {
      activeFilters: [],
      availableFilters: {},
      activeHash: '',
      temporaryFilters: {},
    },
  },
};

export {
  mockedState,
  mockedEmpty,
};
