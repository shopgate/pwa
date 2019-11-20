import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_FAVORITES,
  TAB_MORE,
} from './constants';

const tabs = [
  {
    type: TAB_HOME,
    label: 'tab_bar.home',
  },
  {
    type: TAB_BROWSE,
    label: 'tab_bar.browse',
  },
  {
    type: TAB_CART,
    label: 'tab_bar.cart',
  },
  {
    type: TAB_FAVORITES,
    label: 'tab_bar.favorites',
  },
  {
    type: TAB_MORE,
    label: 'tab_bar.more',
  },
];

if (!appConfig.hasFavorites) {
  tabs.splice(3, 1);
}

export default tabs;
