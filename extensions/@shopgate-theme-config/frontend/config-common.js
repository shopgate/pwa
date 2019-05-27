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
              selectionSettings: {
                selected: {
                  boxShadow: undefined,
                },
                unselected: {
                  boxShadow: undefined,
                },
              },
              elementWidth: '0.8rem',
              elementHeight: '0.8rem',
            },
            styles: {
              swatch: {
                marginBottom: '0.2rem',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                alignContent: 'flex-start',
              },
              element: {
                flexGrow: 0,
                flexShrink: 0,
                flexBasis: 'auto',
                alignSelf: 'auto',
                marginRight: '0.2rem',
                marginBottom: '0.2rem',
                pointerEvents: 'none',
                padding: '1px',
                borderRadius: '50%',
              },
              colorField: {
                borderRadius: '50%',
              },
              textureField: {
                borderRadius: '50%',
                backgroundSize: 'cover',
              },
            },
          },
          {
            name: 'ShopgateProductSwatches',
            id: '@shopgate/engage/product/Swatches',
            settings: {
              maxCount: 10,
            },
            styles: {
              container: {
                lineHeight: undefined,
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
