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
            styles: {
              swatch: undefined,
              item: undefined,
            },
          },
          {
            name: 'ShopgateProductSwatches',
            id: '@shopgate/engage/product/Swatches',
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
          {
            name: 'ShopgateProductSwatch',
            id: '@shopgate/engage/product/Swatch',
            styles: {
              swatch: {
                gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
                gridGap: '12px 8px',
              },
              item: {
                width: '48px',
                height: '48px',
                minWidth: '48px',
                maxWidth: '48px',
                minHeight: '48px',
                maxHeight: '48px',
              },
              itemSelected: undefined,
            },
          },
        ],
      },
    ],
  },
};
