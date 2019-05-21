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
      '@shopgate/engage/product/MediaSlider': {
        videos: {
          controls: false,
          autoPlay: {
            [CONNECTIVITY_TYPE_WIFI]: false,
            [CONNECTIVITY_TYPE_4G]: false,
            [CONNECTIVITY_TYPE_3G]: false,
            [CONNECTIVITY_TYPE_UNKNOWN]: true,
          },
          muted: true,
          loop: false,
          showRelated: null,
          showHints: null,
        },
      },
      '@shopgate/engage/product/MapPrice': {
        show: true,
        showHint: true,
        hint: null,
      },
      '@shopgate/engage/product/EffectivityDates': {
        showStartDate: {
          _comment: 'always|daysBefore|never|',
          strategy: 'always',
          daysBefore: null,
        },
        showEndDate: {
          _comment: 'always|never|daysBefore',
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
        ],
      },
      {
        pattern: '/item/:productId',
        name: 'Product Detail Page',
        settings: {
          '@shopgate/engage/product/MediaSlider': {
            videos: {
              controls: true,
              autoPlay: {
                [CONNECTIVITY_TYPE_WIFI]: true,
              },
            },
          },
        },
        widgets: [
          {
            name: 'ShopgateProductMediaSlider',
            id: '@shopgate/engage/product/MediaSlider',
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
            name: 'ShopgateProductEffectivityDates',
            id: '@shopgate/engage/product/EffectivityDates',
          },
        ],
      },
    ],
  },
};
