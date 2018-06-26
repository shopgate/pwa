import configureStore from 'redux-mock-store';

const router = {
  routing: false,
  stack: [
    {
      id: '44a34767-2683-4414-9de4-fd736808fdab',
      params: {},
      pathname: '/',
      pattern: '/',
      query: {},
      state: {},
    },
  ],
};

export const defaultState = {
  navigator: {
    backgroundColor: 'red',
    filterOpen: false,
    enabled: false,
    searchActive: false,
    searchQuery: '',
    showCartIcon: true,
    showSearch: false,
    showTitle: false,
    showLoadingBar: false,
    textColor: 'white',
    filterAttributeOpen: false,
    loginOpen: false,
    showIconShadow: false,
    showProgressBar: true,
    viewTracking: true,
    navDrawerActive: false,
  },
  router,
  view: {
    isLoading: false,
  },
  ui: {
    general: {
      title: null,
    },
  },
};

/**
 * Creates store.
 * @param {Object} props Props which would override state.navigator props.
 * @return {Object}
 */
export const getStore = props => configureStore()({
  ...defaultState,
  navigator: {
    ...defaultState.navigator,
    ...props,
  },
});
