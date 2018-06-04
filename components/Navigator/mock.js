import configureStore from 'redux-mock-store';

export const defaultState = {
  navigator: {
    backgroundColor: 'red',
    filterOpen: false,
    enabled: false,
    searchActive: false,
    showSearch: false,
    showTitle: false,
    showLoadingBar: false,
    textColor: 'white',
  },
};

/**
 * Creates store.
 * @param {Object} props Props which would override state.navigator props.
 * @return {Object}
 */
export const getStore = props => configureStore()({
  navigator: {
    ...defaultState.navigator,
    ...props,
  },
});
