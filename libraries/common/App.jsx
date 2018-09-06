import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Provider as StoreProvider } from 'redux-props';
import { appDidStart } from './action-creators/app';
import I18n from './components/I18n';

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update');
  // whyDidYouUpdate(React);
}

/**
 * The application component.
 * It sets up the store and the react router. The router's children (routes) come from
 * the theme's Main.jsx file which uses this component as the root element.
 * @returns {JSX}
 */
class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    locale: PropTypes.shape().isRequired,
    store: PropTypes.shape().isRequired,
  };

  /**
   * Registers the component for the native events and fires the onload AppCommand.
   */
  componentDidMount() {
    this.props.store.dispatch(appDidStart(`${window.location.pathname}${window.location.search}`));
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <StoreProvider store={this.props.store}>
        <Provider store={this.props.store}>
          <I18n.Provider locales={this.props.locale} lang={process.env.LOCALE}>
            <div>
              {this.props.children}
            </div>
          </I18n.Provider>
        </Provider>
      </StoreProvider>
    );
  }
}

export default App;
