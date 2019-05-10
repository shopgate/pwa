import {
  CONNECTIVITY_TYPE_WIFI,
  CONNECTIVITY_TYPE_4G,
  CONNECTIVITY_TYPE_3G,
} from '@shopgate/pwa-common/constants/client';

export default {
  controls: true,
  autoPlay: {
    [CONNECTIVITY_TYPE_WIFI]: true,
    [CONNECTIVITY_TYPE_4G]: false,
    [CONNECTIVITY_TYPE_3G]: false,
  },
  muted: true,
  loop: false,
  showRelated: null,
  showHints: null,
};
