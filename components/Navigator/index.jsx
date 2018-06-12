import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common/constants/Portals';
import ProgressBar from '@shopgate/pwa-ui-shared/ProgressBar';
import colors from 'Styles/colors';
import connect from './connector';
import NavButton from './components/NavButton';
import SearchButton from './components/SearchButton';
import CartButton from './components/CartButton';
// Import ApplyFilterButton from './components/ApplyFilterButton';
import Content from './components/Content';
import styles from './style';

export const NavigatorContext = React.createContext({something: 4});

/**
 * The navigator component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
class Navigator extends PureComponent {
  static propTypes = {
    filterOpen: PropTypes.bool.isRequired,
    submitSearch: PropTypes.func.isRequired,
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
      searchField: false,
      searchQuery: '',
    };

    this.context2 = {
      searchField: this.state.searchField,
      searchQuery: this.state.searchQuery,
      toggleSearchField: this.toggleSearchActive,
      setSearchQuery: this.toggleSearchActive,
    };

    UIEvents.addListener('UI_NAVIGATOR_SEARCH_FIELD', this.toggleSearchField);
  }

  /**
   * 
   */
  toggleSearchField = (active) => {
    console.warn(this.context2);
    if (this.state.search === active) {
      return;
    }

    this.setState({
      searchField: active,
    });

    if (active) {
      this.handleSubmitSearch();
    }
  }

  setSearchQuery = (query) => {

  }

  /**
   * 
   */
  handleSubmitSearch = () => {
    if (this.state.searchQuery) {
      // do the thing.
      // replace or push
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

    console.warn(this.context2);
    return (
      <NavigatorContext.Provider value={this.context2}>
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
                      <Content
                        searchActive={this.state.searchField}
                        searchQuery={this.state.searchQuery}
                      />
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
                    <SearchButton searchActive={this.state.searchField} />
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
