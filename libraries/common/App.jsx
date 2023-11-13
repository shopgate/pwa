import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { loadCustomStyles } from '@shopgate/engage/styles';
import ErrorBoundary from './components/ErrorBoundary';
import { appDidStart } from './action-creators/app';
import I18n from './components/I18n';
import { getIsSessionExpired } from './selectors/user';
import logout from './actions/user/logout';

/**
 * The application component.
 * It sets up the store and the react router. The router's children (routes) come from
 * the theme's Main.jsx file which uses this component as the root element.
 * @returns {JSX}
 */
class App extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.shape().isRequired,
  };

  /**
   * Registers the component for the native events and fires the onload AppCommand.
   */
  componentDidMount() {
    /**
     * Async helper function that performs optional steps before appDidStart action is dispatched
     */
    const performAppStart = async () => {
      if (getIsSessionExpired(this.props.store.getState())) {
        // Logout the user before appDidStart when session is expired
        try {
          await this.props.store.dispatch(logout(undefined, true));
        } catch (e) {
          // Noting to do here
          console.error('AppStartLogout failed', e);
        }
      }

      this.props.store.dispatch(appDidStart(`${window.location.pathname}${window.location.search}`));
    };

    performAppStart();
    loadCustomStyles();
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <CookiesProvider>
        <ErrorBoundary key="error.root" store={this.props.store} isRoot>
          <Provider store={this.props.store}>
            <I18n.Provider>
              <div>
                {this.props.children}
              </div>
            </I18n.Provider>
          </Provider>
        </ErrorBoundary>
      </CookiesProvider>
    );
  }
}

export default App;
