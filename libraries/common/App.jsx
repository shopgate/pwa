import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import hideSplashScreen from '@shopgate/pwa-core/commands/hideSplashScreen';
import initSubscribers from './subscriptions';
import {
  appDidStart,
  appWillStart,
} from './action-creators/app';
import { syncHistoryWithStore } from './helpers/redux';
import { history } from './helpers/router';
import HistoryStack from './components/Router/helpers/HistoryStack';
import fetchClientInformation from './actions/client/fetchClientInformation';
import configureStore from './store';
import I18n from './components/I18n';
import Router from './components/Router';
import smoothscrollPolyfill from './helpers/scrollPolyfill';

injectTapEventPlugin();
smoothscrollPolyfill();

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
    reducers: PropTypes.shape(),
    subscribers: PropTypes.arrayOf(PropTypes.func),
  };

  static defaultProps = {
    reducers: {},
    subscribers: [],
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    // Initialize the subscriptions to observable streams.
    initSubscribers(this.props.subscribers);

    this.store = configureStore(props.reducers);

    this.store.dispatch(appWillStart(history.location));

    // Start synchronization of the history stack.
    this.historyStack = new HistoryStack({
      key: 'root',
      immutableKey: 'root',
      ...history.location,
    });
    history.listen((location, action) =>
      this.historyStack.applyChange(action, location));
  }

  /**
   * Registers the component for the native events and fires the onload AppCommand.
   */
  componentDidMount() {
    this.store.dispatch(appDidStart());

    hideSplashScreen();

    // Start synchronization of history and redux store.
    syncHistoryWithStore(history, this.store, this.historyStack);

    this.store.dispatch(fetchClientInformation());
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <Provider store={this.store}>
        <I18n.Provider locales={this.props.locale} lang={process.env.LOCALE}>
          <Router history={this.historyStack}>
            {this.props.children}
          </Router>
        </I18n.Provider>
      </Provider>
    );
  }
}

export default App;
