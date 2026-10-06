import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_DEFAULT_BEFORE,
  APP_BAR_DEFAULT,
  APP_BAR_DEFAULT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import {
  withRoute, withApp, INDEX_PATH, router,
} from '@shopgate/engage/core';
import { i18n } from '@shopgate/engage/core/helpers';
import { getCSSCustomProp } from '@shopgate/engage/styles';
import { ViewContext } from '@shopgate/engage/components/View';
import { useSelector } from 'react-redux';
import { getPersistentSearchBarSettings } from '@shopgate/engage/settings/selectors/appSettings';
import { SEARCH_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import ConfiguredBar from '../../components/ConfiguredBar';
import Headline from '../../components/Headline';
import SearchBar from '../../../Search/SearchBar';
import { useAppBarSettings } from '../../hooks';
import {
  ACTION_BUTTONS_HIDDEN_PATTERNS, OVERLAY_PATTERNS, SEARCH_BAR_PAGE_TYPES,
} from '../../constants';
import AppBarIcon from './components/Icon';
import ProgressBar from './components/ProgressBar';
import connect from './connector';

/**
 * The AppBarDefault component.
 */
class AppBarDefault extends PureComponent {
  static propTypes = {
    app: PropTypes.shape().isRequired,
    appBarSettings: PropTypes.shape().isRequired,
    modern: PropTypes.bool.isRequired,
    overlay: PropTypes.bool.isRequired,
    resetStatusBar: PropTypes.func.isRequired,
    route: PropTypes.shape().isRequired,
    setFocus: PropTypes.bool.isRequired,
    showActions: PropTypes.bool.isRequired,
    updateStatusBar: PropTypes.func.isRequired,
    'aria-hidden': PropTypes.bool,
    below: PropTypes.node,
    center: PropTypes.node,
    searchBar: PropTypes.shape({
      hideOnScroll: PropTypes.bool,
      query: PropTypes.string,
    }),
    title: PropTypes.string,
  };

  static defaultProps = {
    'aria-hidden': null,
    below: null,
    center: undefined,
    searchBar: null,
    title: null,
  };

  /**
   * @param {Object} props The component props
   */
  constructor(props) {
    super(props);
    this.state = {
      target: document.getElementById('AppHeader'),
    };
  }

  /**
   * Sets the target if it hasn't been set before.
   */
  componentDidMount() {
    let { target } = this.state;

    if (!target) {
      target = document.getElementById('AppHeader');
      this.setState({ target: target || null });
    }

    if (this.props.setFocus && target) {
    // Set the focus to the app bar title or else to the first focusable element for screen readers.
      const focusable = target.querySelector('.theme__app-bar__title') || target.querySelector('button:not([aria-hidden="true"]), [tabindex]:not([tabindex="-1"])');

      if (focusable) {
        focusable.focus();
      }
    }

    if (this.props.route.visible) {
      this.updateStatusBar();

      if (this.props.title) {
        if (this.props.route.state.title !== this.props.title) {
          router.update(this.props.route.id, { title: i18n.text(this.props.title) });
        }
      }
    }
  }

  /**
   * Syncs the colors of the device status bar with the colors of the AppBar when it came visible.
   * @param {Object} prevProps The previous component props.
   */
  componentDidUpdate(prevProps) {
    if (!this.props.route.visible) {
      // Only visible app bars trigger color syncing.
      return;
    }

    const routeDidEnter =
      prevProps.route.visible === false && this.props.route.visible === true;
    const engageDidEnter =
      prevProps.app.isVisible === false && this.props.app.isVisible === true;
    const engageWillLeave =
      prevProps.app.isVisible === true && this.props.app.isVisible === false;

    if (routeDidEnter || engageDidEnter || prevProps.overlay !== this.props.overlay) {
      // Sync the colors of the app bar when the route with the bar came visible.
      this.updateStatusBar();
    }

    if (engageWillLeave) {
      // Reset the status bar when Engage goes into the background.
      this.props.resetStatusBar();
    }

    if (prevProps.title !== this.props.title && this.props.route.state.title !== this.props.title) {
      router.update(this.props.route.id, { title: i18n.text(this.props.title) });
    }
  }

  /**
   * Updates the status bar styling.
   */
  updateStatusBar() {
    const { pathname } = this.props.route;
    /**
     * The settings for the startpage need to be preserved within the statusbar to optimize
     * the initial rendering at the app start.
     *
     * The native status bar needs a resolved color value, so the app bar background is read
     * from the live custom property rather than passed along as a var() reference.
     */
    this.props.updateStatusBar(
      this.props.overlay ? 'transparent' : getCSSCustomProp('--sg-components-appBar-background'),
      pathname === INDEX_PATH
    );
  }

  /**
   * @returns {JSX}
   */
  render() {
    const {
      app,
      appBarSettings,
      modern,
      overlay,
      resetStatusBar,
      route,
      searchBar,
      setFocus,
      showActions,
      updateStatusBar,
      ...barProps
    } = this.props;

    const headline = modern && !overlay && barProps.center === undefined
      ? <Headline title={i18n.text(barProps.title || '')} />
      : null;

    if (!route.visible || !this.state.target) {
      return headline;
    }

    const below = (
      <Fragment key="below">
        {searchBar && <SearchBar query={searchBar.query} hideOnScroll={searchBar.hideOnScroll} />}
        {barProps.below}
        <ProgressBar />
      </Fragment>
    );

    return (
      <>
        {headline}
        {ReactDOM.createPortal(
          <>
            <Portal name={APP_BAR_DEFAULT_BEFORE} />
            <Portal name={APP_BAR_DEFAULT}>
              <ConfiguredBar
                {...barProps}
                settings={appBarSettings}
                modern={modern}
                overlay={overlay}
                showActions={showActions}
                below={below}
                aria-hidden={barProps['aria-hidden']}
              />
            </Portal>
            <Portal name={APP_BAR_DEFAULT_AFTER} />
          </>,
          this.state.target
        )}
      </>
    );
  }
}

/**
 * The AppBarDefaultWithContext component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AppBarDefaultWithContext = ({ actionButtons, ...props }) => {
  const appBarSettings = useAppBarSettings();
  const { pattern } = props.route;
  const modern = appBarSettings.style === 'modern';
  const overlay = modern && OVERLAY_PATTERNS.includes(pattern);
  const showActions = actionButtons && !ACTION_BUTTONS_HIDDEN_PATTERNS.includes(pattern);
  const searchBarSettings = useSelector(getPersistentSearchBarSettings);
  const searchBarPage = SEARCH_BAR_PAGE_TYPES[pattern];
  const isSearch = pattern === SEARCH_PATTERN;
  const searchBar = actionButtons && searchBarPage && searchBarSettings[searchBarPage]
    ? {
      query: isSearch ? props.route.query?.s || '' : '',
      hideOnScroll: searchBarSettings.hideOnScroll,
    }
    : null;
  const titleProps = searchBar && isSearch ? { center: null } : {};

  return (
    <ViewContext.Consumer>
      {({ ariaHidden }) => (
        <AppBarDefault
          {...props}
          {...titleProps}
          searchBar={searchBar}
          appBarSettings={appBarSettings}
          modern={modern}
          overlay={overlay}
          showActions={showActions}
          aria-hidden={ariaHidden}
        />
      )}
    </ViewContext.Consumer>
  );
};

AppBarDefaultWithContext.propTypes = {
  route: PropTypes.shape().isRequired,
  actionButtons: PropTypes.bool,
};

AppBarDefaultWithContext.defaultProps = {
  actionButtons: true,
};

const WrappedComponent = withApp(withRoute(connect(AppBarDefaultWithContext), { prop: 'route' }));

WrappedComponent.Icon = AppBarIcon;

export default WrappedComponent;
