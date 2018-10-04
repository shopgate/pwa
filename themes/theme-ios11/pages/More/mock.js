import configureStore from 'redux-mock-store';

const defaultState = {
  client: {
    isFetching: false,
    appVersion: '0-app',
    libVersion: '0-lib',
    codeBaseVersion: '0-code',
  },
  menu: {
    menusById: {
      quickLinks: {
        entries: [
          {
            url: '/page/test',
            label: 'CMS Test',
          },
        ],
      },
    },
  },
};

const userLoggedInState = {
  ...defaultState,
  user: {
    login: {
      isLoggedIn: true,
    },
    data: {
      firstName: 'John',
      lastName: 'Doe',
    },
  },
};

const userLoggedOutState = {
  ...defaultState,
  user: {
    login: {
      isLoggedIn: false,
    },
    data: {},
  },
};

/**
 * Mocked store.
 * @returns {Object}
 */
export const getLoggedInStore = () => configureStore()(userLoggedInState);

/**
 * Mocked store.
 * @returns {Object}
 */
export const getLoggedOutStore = () => configureStore()(userLoggedOutState);
