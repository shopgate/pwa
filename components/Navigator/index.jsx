import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common/constants/Portals';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import ProgressBar from '@shopgate/pwa-ui-shared/ProgressBar';
import { ACTION_PUSH, ACTION_REPLACE } from '@virtuous/conductor/constants';
import * as events from '@virtuous/conductor-events';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import colors from 'Styles/colors';
import connect from './connector';
import NavButton from './components/NavButton';
import SearchButton from './components/SearchButton';
import CartButton from './components/CartButton';
// Import ApplyFilterButton from './components/ApplyFilterButton';
import Content from './components/Content';
import NavigatorContext from './context';
import styles from './style';

/**
 * The navigator component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
class Navigator extends PureComponent {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
    backgroundColor: PropTypes.string,
    navigatorEnabled: PropTypes.bool,
    showLoadingBar: PropTypes.bool,
    showSearch: PropTypes.bool,
    showTitle: PropTypes.bool,
    textColor: PropTypes.string,
  };

  static defaultProps = {
    backgroundColor: colors.light,
    navigatorEnabled: true,
    showLoadingBar: false,
    showSearch: true,
    showTitle: true,
    textColor: colors.dark,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      routePattern: '',
      searchField: false,
      searchQuery: '',
    };

    events.onDidPush(this.setRoutePattern);
    events.onDidPop(this.setRoutePattern);
    events.onDidReplace(this.setRoutePattern);
  }

  /**
   * @param {string} id The id of the route that entered.
   */
  setRoutePattern = () => {
    const { pattern } = getCurrentRoute();

    if (this.state.routePattern !== pattern) {
      this.setState({
        routePattern: pattern,
      });
    }
  }

  /**
   * @param {string} query The new search query.
   */
  setSearchQuery = (query) => {
    if (this.state.searchQuery !== query) {
      this.setState({
        searchQuery: query,
      });
    }
  }

  /**
   * @param {boolean} active The new state for the search field.
   */
  toggleSearchField = (active) => {
    if (this.state.searchField === active) {
      return;
    }

    this.setState({
      searchField: active,
    });

    if (!active) {
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
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    if (!this.props.navigatorEnabled) {
      return null;
    }

    const headerStyle = {
      background: this.props.backgroundColor,
      color: this.props.textColor,
    };

    const context = {
      ...this.state,
      toggleSearchField: this.toggleSearchField,
      setSearchQuery: this.setSearchQuery,
    };

    return (
      <NavigatorContext.Provider value={context}>
        <Portal name={portals.NAV_BAR_BEFORE} />
        <Portal name={portals.NAV_BAR}>
          <header
            className={styles.header}
            data-test-id="Navigator"
            role="banner"
            style={headerStyle}
          >
            <Portal name={portals.NAV_BAR_NAVIGATOR_BEFORE} />
            <Portal name={portals.NAV_BAR_NAVIGATOR}>
              <Grid className={styles.grid} component="section" wrap={false}>
                <Portal name={portals.NAV_BAR_NAVIGATOR_NAV_BUTTON_BEFORE} />
                <Portal name={portals.NAV_BAR_NAVIGATOR_NAV_BUTTON} props={{ NavButton }}>
                  <NavButton />
                </Portal>
                <Portal name={portals.NAV_BAR_NAVIGATOR_NAV_BUTTON_AFTER} />
                <Portal name={portals.NAV_BAR_NAVIGATOR_CENTER_BEFORE} />
                <Portal name={portals.NAV_BAR_NAVIGATOR_CENTER}>
                  <Grid.Item className={styles.title} component="div" grow={1}>
                    {this.props.showTitle &&
                      <Content routePattern={this.state.routePattern} />
                    }
                  </Grid.Item>
                </Portal>
                <Portal name={portals.NAV_BAR_NAVIGATOR_CENTER_AFTER} />
                <Portal name={portals.NAV_BAR_NAVIGATOR_ICONS_BEFORE} />
                <Portal name={portals.NAV_BAR_NAVIGATOR_ICONS} >
                  {/*(this.props.filterOpen) &&
                  <div className={styles.applyButton}>
                    <ApplyFilterButton />
                  </div>
                  */}
                  {this.props.showSearch &&
                    <SearchButton />
                  }
                  <Portal name={portals.NAV_BAR_NAVIGATOR_ICONS_CART_BUTTON_BEFORE} />
                  <Portal name={portals.NAV_BAR_NAVIGATOR_ICONS_CART_BUTTON} props={{ CartButton }}>
                    <CartButton />
                  </Portal>
                  <Portal name={portals.NAV_BAR_NAVIGATOR_ICONS_CART_BUTTON_AFTER} />
                </Portal>
                <Portal name={portals.NAV_BAR_NAVIGATOR_ICONS_AFTER} />
              </Grid>
            </Portal>
            <Portal name={portals.NAV_BAR_NAVIGATOR_AFTER} />
            <Portal name={portals.NAV_BAR_PROGRESS_BAR_BEFORE} />
            <Portal name={portals.NAV_BAR_PROGRESS_BAR} props={{ ProgressBar }}>
              <ProgressBar isVisible={this.props.showLoadingBar} />
            </Portal>
            <Portal name={portals.NAV_BAR_PROGRESS_BAR_AFTER} />
          </header>
        </Portal>
        <Portal name={portals.NAV_BAR_AFTER} />
      </NavigatorContext.Provider>
    );
  }
}

export default connect(Navigator);
