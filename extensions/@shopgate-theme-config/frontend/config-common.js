import {
  CONNECTIVITY_TYPE_WIFI,
  CONNECTIVITY_TYPE_4G,
  CONNECTIVITY_TYPE_3G,
  CONNECTIVITY_TYPE_UNKNOWN,
} from '@shopgate/pwa-common/constants/client';

export default {
  beta: true,
  theme: {
    settings: {
      '@shopgate/engage/product/MapPrice': {
        show: true,
        showHint: true,
        hint: null,
      },
      '@shopgate/engage/product/OrderQuantityHint': {
        show: true,
      },
      '@shopgate/engage/product/EffectivityDates': {
        showStartDate: {
          strategy: 'always',
          daysBefore: null,
        },
        showEndDate: {
          strategy: 'always',
          daysBefore: null,
        },
        accessExpired: false,
      },
      '@shopgate/engage/product/Swatches': {
        maxItemCount: 10,
        filter: [],
      },
    },
    pages: [
      {
        pattern: '/category/:categoryId',
        name: 'Product List Page',
        settings: {},
        widgets: [
          {
            name: 'ShopgateProductMapPrice',
            id: '@shopgate/engage/product/MapPrice',
          },
          {
            name: 'ShopgateProductOrderQuantityHint',
            id: '@shopgate/engage/product/OrderQuantityHint',
          },
          {
            name: 'ShopgateProductSwatch',
            id: '@shopgate/engage/product/Swatch',
            settings: {
              selectionStyles: {
                selected: {
                  borderColor: undefined,
                },
                unselected: {
                  borderColor: undefined,
                },
              },
              itemWidth: '0.8rem',
              itemHeight: '0.8rem',
            },
            styles: {
              swatch: {
                marginBottom: '0.3rem',
              },
              item: {
                marginRight: '0.2rem',
                marginBottom: '0.2rem',
              },
            },
          },
          {
            name: 'ShopgateProductSwatches',
            id: '@shopgate/engage/product/Swatches',
            settings: {},
            styles: {
              swatches: {
                marginTop: '0.4rem',
              },
            },
          },
        ],
      },
      {
        pattern: '/item/:productId',
        name: 'Product Detail Page',
        settings: {},
        widgets: [
          {
            name: 'ShopgateProductMediaSlider',
            id: '@shopgate/engage/product/MediaSlider',
            settings: {
              videos: {
                controls: false,
                autoPlay: {
                  [CONNECTIVITY_TYPE_WIFI]: true,
                  [CONNECTIVITY_TYPE_4G]: false,
                  [CONNECTIVITY_TYPE_3G]: false,
                  [CONNECTIVITY_TYPE_UNKNOWN]: false,
                },
                muted: true,
                loop: false,
                showRelated: null,
                showHints: null,
              },
            },
          },
          {
            name: 'ShopgateProductProperties',
            id: '@shopgate/engage/product/ProductProperties',
          },
          {
            name: 'ShopgateProductMapPrice',
            id: '@shopgate/engage/product/MapPrice',
            styles: {
              hint: {
                fontSize: '1rem',
              },
            },
          },
          {
            name: 'ShopgateProductQuantityPicker',
            id: '@shopgate/engage/product/QuantityPicker',
            settings: {
              minOrderQuantity: 1,
              maxOrderQuantity: 50,
            },
            styles: {
              sheet: {
                maxHeight: '50vh',
                minHeight: '50vh',
              },
            },
          },
          {
            name: 'ShopgateProductOrderQuantityHint',
            id: '@shopgate/engage/product/OrderQuantityHint',
          },
          {
            name: 'ShopgateProductEffectivityDates',
            id: '@shopgate/engage/product/EffectivityDates',
          },
        ],
      },
    ],
  },
};
