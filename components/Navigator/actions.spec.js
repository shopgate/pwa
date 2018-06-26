import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { cartState } from '@shopgate/pwa-common-commerce/cart/mock';
import disableNavigator from './actions/disableNavigator';
import disableNavigatorIconShadow from './actions/disableNavigatorIconShadow';
import disableNavigatorSearch from './actions/disableNavigatorSearch';
import disableNavigatorTitle from './actions/disableNavigatorTitle';
import enableNavigator from './actions/enableNavigator';
import enableNavigatorIconShadow from './actions/enableNavigatorIconShadow';
import enableNavigatorSearch from './actions/enableNavigatorSearch';
import enableNavigatorTitle from './actions/enableNavigatorTitle';
import setNavigatorBrackground from './actions/setNavigatorBackground';
import setNavigatorColor from './actions/setNavigatorColor';
import setNavigatorSearchPhrase from './actions/setNavigatorSearchPhrase';
import toggleCartIcon from './actions/toggleCartIcon';
import toggleNavDrawer from './actions/toggleNavDrawer';
import toggleNavSearchField from './actions/toggleNavSearchField';
import toggleProgressBar from './actions/toggleProgressBar';

import { defaultState } from './mock';
import * as types from './constants';

const mockedStore = configureStore([thunk]);
/**
 * Creates a mocked store with navigator props.
 * @param {Object} props Navigator props
 * @param {Object} state Extended state.
 * @return {*}
 */
const getStore = (props, state = {}) => (
  mockedStore({
    ...defaultState,
    ...state,
    navigator: {
      ...defaultState.navigator,
      ...props,
    },
  })
);

const states = [
  { enabled: true },
  { showIconShadow: true },
  { showSearch: true },
  { showTitle: true },
  { enabled: false },
  { showIconShadow: false },
  { showSearch: false },
  { showTitle: false },
  { backgroundColor: '#ffffff' },
  { textColor: '#000000' },
  { searchPhrase: '' },
  { showCartIcon: true },
  { navDrawerActive: true },
  { searchActive: false },
  { showProgressBar: false },
];

const params = {
  setNavigatorBackground: '#333333',
  setNavigatorColor: 'red',
  setNavigatorSearchPhrase: 'shirt',
  toggleCartIcon: false,
  toggleNavDrawer: false,
  toggleNavSearchField: true,
  toggleProgressBar: true,
};

const actions = [
  disableNavigator,
  disableNavigatorIconShadow,
  disableNavigatorSearch,
  disableNavigatorTitle,
  enableNavigator,
  enableNavigatorIconShadow,
  enableNavigatorSearch,
  enableNavigatorTitle,
  setNavigatorBrackground,
  setNavigatorColor,
  setNavigatorSearchPhrase,
  toggleCartIcon,
  toggleNavDrawer,
  toggleNavSearchField,
  toggleProgressBar,
];

const stateExtend = {
  toggleCartIcon: {
    cart: cartState.cart,
  },
};

const results = [
  [{ type: types.SET_NAVIGATOR_DISABLED }],
  [{ type: types.SET_ICON_SHADOW_DISABLED }],
  [{ type: types.SET_SEARCH_DISABLED }],
  [{ type: types.SET_TITLE_DISABLED }],
  [{ type: types.SET_NAVIGATOR_ENABLED }],
  [{ type: types.SET_ICON_SHADOW_ENABLED }],
  [{ type: types.SET_SEARCH_ENABLED }],
  [{ type: types.SET_TITLE_ENABLED }],
  [{ type: types.SET_NAVIGATOR_BACKGROUND, color: '#333333' }],
  [{ type: types.SET_NAVIGATOR_COLOR, color: 'red' }],
  [{ type: types.SET_NAVIGATOR_SEARCH_QUERY, query: 'shirt' }],
  [{ type: types.TOGGLE_NAVIGATOR_CART_ICON, active: false }],
  [{ type: types.TOGGLE_NAV_DRAWER, active: false }],
  [{ type: types.TOGGLE_NAVIGATOR_SEARCH, active: true }],
  [{ type: types.TOGGLE_PROGRESS_BAR, active: true }],
];

describe('Navigator actions', () => {
  let store;
  afterEach(() => {
    store.clearActions();
  });
  actions.forEach((action, index) => {
    it(`should ${action.name}`, () => {
      store = getStore(
        states[index],
        stateExtend[action.name] || {}
      );

      if (params.hasOwnProperty(action.name)) {
        store.dispatch(action(params[action.name]));
      } else {
        store.dispatch(action());
      }

      expect(store.getActions()).toEqual(results[index]);
    });
  });
});
