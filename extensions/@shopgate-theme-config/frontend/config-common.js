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
      product: {
        effectivityDates: {
          showScheduled: 'never',
          accessExpired: false,
        },
      },
      '@shopgate/engage/product/MapPrice': {
        show: true,
        showHint: true,
        hint: null,
      },
      '@shopgate/engage/product/OrderQuantityHint': {
        show: true,
      },
      '@shopgate/engage/product/EffectivityDates': {
        scheduledProducts: {
          showLabels: 'always',
        },
        expiringProducts: {
          showLabels: 'always',
        },
      },
      '@shopgate/engage/product/Swatches': {
        maxItemCount: 10,
        filter: [],
      },
      '@shopgate/engage/product/RelationsSlider': {
        type: 'upselling', // upselling, crossSelling, bonus, boughtWith, custom.
        position: 'header', // header, description.
        headline: 'Wird oft zusammen gekauft',
        titleRows: 2,
        hidePrice: false,
        hideStrikePrice: false,
        hideBasePrice: false,
        hideRating: false,
        showProductProperties: false,
        showAvailabilityText: true,
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
            styles: {
              hint: {
                fontSize: '0.875rem',
              },
            },
          },
          {
            name: 'ShopgateProductSwatch',
            id: '@shopgate/engage/product/Swatch',
            styles: {
              swatch: {
                gridTemplateColumns: 'repeat(auto-fill, minmax($.variables.swatchItemSize, 1fr))',
                gridGap: '12px 8px',
              },
              item: {
                width: '$.variables.swatchItemSize',
                minWidth: '$.variables.swatchItemSize',
                maxWidth: '$.variables.swatchItemSize',
                height: '$.variables.swatchItemSize',
                minHeight: '$.variables.swatchItemSize',
                maxHeight: '$.variables.swatchItemSize',
                borderWidth: '2px',
              },
              itemSelected: undefined,
            },
          },
          {
            name: 'RelationsSlider',
            id: '@shopgate/engage/product/RelationsSlider',
          },
        ],
      },
    ],
    variables: {
      swatchItemSize: '48px',
    },
  },
};
