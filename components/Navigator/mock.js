import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

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
    enabled: true,
    filterOpen: false,
    filterAttributeOpen: false,
    loginOpen: false,
    searchActive: false,
    showCartIcon: true,
    showIconShadow: false,
    showProgressBar: true,
    showSearch: true,
    showTitle: true,
    textColor: 'white',
    viewTracking: false,
  },
  search: {
    suggestion: {},
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
export const getStore = props => configureStore([thunk])({
  ...defaultState,
  navigator: {
    ...defaultState.navigator,
    ...props,
  },
  search: {
    suggestions: {},
  },
});
