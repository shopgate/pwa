import {
  CONNECTIVITY_TYPE_WIFI,
  CONNECTIVITY_TYPE_4G,
  CONNECTIVITY_TYPE_3G,
  CONNECTIVITY_TYPE_UNKNOWN,
} from '@shopgate/pwa-common/constants/client';

export default {
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
  },
  typography: {
    family: 'Roboto, Arial, sans-serif',
    rootSize: 16,
    lineHeight: 1.5,
  },
  colors: {
    background: '#f8f8f8',
    light: '#fff',
    dark: '#000',
    placeholder: '#f2f2f2',
    primary: '#fa5400',
    primaryContrast: '#fff',
    accent: '#5ccee3',
    accentContrast: '#fff',
    cta: '#fa5400',
    ctaContrast: '#fff',
    darkGray: '#eaeaea',
    focus: '#fa5400',
    shade3: '#9a9a9a',
    shade4: '#b5b5b5',
    shade5: '#ccc',
    shade6: '#656565',
    shade7: '#eaeaea',
    shade8: '#f7f7f7',
    shade9: '#8d8d8d',
    shade10: '#f4f4f4',
    shade11: '#747474',
    shade12: '#939393',
    success: '#35cc29',
    warning: '#ff9300',
    error: '#ff0000',
  },
  variables: {
    baseShadow: 'rgba(0, 0, 0, .117647) 0 1px 6px, rgba(0, 0, 0, .117647) 0 1px 4px',
  },
  shadows: {},
  assets: {},
  pages: [
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
      ],
    },
  ],
};
