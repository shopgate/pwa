import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { UIEvents } from '@shopgate/pwa-core';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common/constants/Portals';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import {
  ACTION_PUSH,
  ACTION_REPLACE,
} from '@virtuous/conductor/constants';
import * as events from '@virtuous/conductor-events';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import colors from 'Styles/colors';
import connect from './connector';
import {
  PORTAL_NAVIGATOR_BUTTON,
  TOGGLE_NAVIGATOR,
  SET_NAVIGATOR_BACKGROUND,
  SET_NAVIGATOR_COLOR,
} from './constants';
import NavButton from './components/NavButton';
import SearchButton from './components/SearchButton';
import CartButton from './components/CartButton';
import Content from './components/Content';
import ProgressBar from './components/ProgressBar';
import { NavigatorContext } from './context';
import styles from './style';

/**
 * The Navigator component.
 */
export class Navigator extends PureComponent {
  static propTypes = {
    fetchSuggestions: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: colors.light,
      routePattern: '',
      searchField: false,
      searchQuery: '',
      textColor: colors.dark,
      visible: true,
    };
  }

  /**
   * Initially set the route pattern and event listeners. This is necessary to determine which
   * route is the first when the app is opened.
   */
  componentDidMount() {
    events.onDidPush(this.setRoutePattern);
    events.onDidPop(this.setRoutePattern);
    events.onDidReplace(this.setRoutePattern);
    events.onDidReset(this.setRoutePattern);
    UIEvents.on(TOGGLE_NAVIGATOR, this.setVisible);
    UIEvents.on(SET_NAVIGATOR_BACKGROUND, this.setBackground);
    UIEvents.on(SET_NAVIGATOR_COLOR, this.setColor);
    this.setRoutePattern();
  }

  /**
   * @returns {Object}
   */
  get barStyle() {
    return {
      background: this.state.backgroundColor,
      color: this.state.textColor,
    };
  }

  /**
   * @returns {Object}
   */
  get providedContext() {
    return {
      ...this.state,
      toggleSearchField: this.toggleSearchField,
      setSearchQuery: this.setSearchQuery,
    };
  }

  /**
   * @param {string} color The next background color.
   */
  setBackground = (color) => {
    this.setState({ backgroundColor: color });
  }

  /**
   * @param {string} color The next text color.
   */
  setColor = (color) => {
    this.setState({ textColor: color });
  }

  /**
   * @param {boolean} visible The next visible state.
   */
  setVisible = (visible) => {
    this.setState({ visible });
  }

  setRoutePattern = () => {
    const { pattern } = getCurrentRoute();
    this.setState({ routePattern: pattern });
  }

  /**
   * @param {string} query The next search query.
   */
  setSearchQuery = (query) => {
    this.setState({
      searchQuery: query,
    }, this.fetchSuggestions);
  }

  /**
   * Fetch search suggestions with the locally set search query.
   */
  fetchSuggestions = throttle(() => {
    this.props.fetchSuggestions(this.state.searchQuery);
  }, 1000)

  /**
   * @param {boolean} active The new state for the search field.
   * @param {boolean} submit Whether or not to submit the search.
   */
  toggleSearchField = (active = false, submit = false) => {
    if (this.state.searchField === active) {
      return;
    }

    this.setState({
      searchField: active,
    });

    if (submit && !active) {
      this.handleSubmitSearch();
    }
  }

  /**
   * Navigate to the search route. If we are already
   * on the search route then perform a history replace
   * action instead. This is to not pollute the history.
   */
  handleSubmitSearch = () => {
    if (this.state.searchQuery) {
      const isSearchRoute = (this.state.routePattern === SEARCH_PATH);
      const action = (isSearchRoute) ? ACTION_REPLACE : ACTION_PUSH;

      this.props.navigate(action, `/search?s=${this.state.searchQuery}`);
    }
  }

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.state.visible) {
      return null;
    }

    return (
      <NavigatorContext.Provider value={this.providedContext}>
        <Portal name={portals.NAV_BAR_BEFORE} />
        <Portal name={portals.NAV_BAR}>
          <header
            className={styles.header}
            data-test-id="Navigator"
            role="banner"
            style={this.barStyle}
          >
            <Portal name={portals.NAV_BAR_NAVIGATOR_BEFORE} />
            <Portal name={portals.NAV_BAR_NAVIGATOR}>
              <Grid className={styles.grid} component="section" wrap={false}>
                <NavButton pattern={this.state.routePattern} />
                <Portal name={portals.NAV_BAR_NAVIGATOR_CENTER_BEFORE} />
                <Portal name={portals.NAV_BAR_NAVIGATOR_CENTER}>
                  <Grid.Item className={styles.title} component="div" grow={1}>
                    <Content routePattern={this.state.routePattern} />
                  </Grid.Item>
                </Portal>
                <Portal name={portals.NAV_BAR_NAVIGATOR_CENTER_AFTER} />
                <Portal name={portals.NAV_BAR_NAVIGATOR_ICONS_BEFORE} />
                <Portal name={portals.NAV_BAR_NAVIGATOR_ICONS}>
                  <div className={styles.portal} id={PORTAL_NAVIGATOR_BUTTON} />
                  <SearchButton />
                  <CartButton />
                </Portal>
                <Portal name={portals.NAV_BAR_NAVIGATOR_ICONS_AFTER} />
              </Grid>
            </Portal>
            <Portal name={portals.NAV_BAR_NAVIGATOR_AFTER} />
            <ProgressBar />
          </header>
        </Portal>
        <Portal name={portals.NAV_BAR_AFTER} />
      </NavigatorContext.Provider>
    );
  }
}

export default connect(Navigator);
