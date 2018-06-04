import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import syncRouter from '@virtuous/redux-conductor';
import hideSplashScreen from '@shopgate/pwa-core/commands/hideSplashScreen';
import initSubscribers from './subscriptions';
import {
  appDidStart,
  appWillStart,
} from './action-creators/app';
import fetchClientInformation from './actions/client/fetchClientInformation';
import configureStore from './store';
import I18n from './components/I18n';
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
    reducers: PropTypes.func.isRequired,
    Worker: PropTypes.func.isRequired,
    subscribers: PropTypes.arrayOf(PropTypes.func),
  };

  static defaultProps = {
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

    this.store = configureStore(props.reducers, props.Worker);
    syncRouter(this.store);
    this.store.dispatch(appWillStart(`${window.location.pathname}${window.location.search}`));
  }

  /**
   * Registers the component for the native events and fires the onload AppCommand.
   */
  componentDidMount() {
    this.store.dispatch(appDidStart(`${window.location.pathname}${window.location.search}`));
    hideSplashScreen();
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
          <div>
            {this.props.children}
          </div>
        </I18n.Provider>
      </Provider>
    );
  }
}

export default App;
