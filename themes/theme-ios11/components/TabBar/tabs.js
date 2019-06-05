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
    'aria-hidden': true,
    tabIndex: -1,
  },
  {
    type: TAB_BROWSE,
    label: 'tab_bar.browse',
    'aria-hidden': false,
    tabIndex: 0,
  },
  {
    type: TAB_CART,
    label: 'tab_bar.cart',
    'aria-hidden': true,
    tabIndex: -1,
  },
  {
    type: TAB_FAVORITES,
    label: 'tab_bar.favorites',
    'aria-hidden': true,
    tabIndex: -1,
  },
  {
    type: TAB_MORE,
    label: 'tab_bar.more',
    'aria-hidden': true,
    tabIndex: -1,
  },
];

if (!appConfig.hasFavorites) {
  tabs.splice(3, 1);
}

export default tabs;
