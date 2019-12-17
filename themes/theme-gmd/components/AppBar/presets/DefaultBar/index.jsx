import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AppBar, NavDrawer } from '@shopgate/pwa-ui-material';
import { BurgerIcon } from '@shopgate/pwa-ui-shared';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_DEFAULT_BEFORE,
  APP_BAR_DEFAULT,
  APP_BAR_DEFAULT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import {
  withRoute, withWidgetSettings, withApp, INDEX_PATH, router, UIEvents,
} from '@shopgate/engage/core';

import { ViewContext } from 'Components/View/context';
import AppBarIcon from './components/Icon';
import CartButton from './components/CartButton';
import SearchButton from './components/SearchButton';
import ProgressBar from './components/ProgressBar';
import connect from './connector';

/**
 * The AppBarDefault component.
 */
class AppBarDefault extends PureComponent {
  static propTypes = {
    app: PropTypes.shape().isRequired,
    resetStatusBar: PropTypes.func.isRequired,
    route: PropTypes.shape().isRequired,
    setFocus: PropTypes.bool.isRequired,
    updateStatusBar: PropTypes.func.isRequired,
    widgetSettings: PropTypes.shape().isRequired,
    'aria-hidden': PropTypes.bool,
    below: PropTypes.node,
    title: PropTypes.string,
  };

  static defaultProps = {
    'aria-hidden': null,
    title: null,
    below: null,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  state = {
    target: document.getElementById('AppHeader'),
  }

  /**
   * Constructor
   * @param {Object} props The component properties
   */
  constructor(props) {
    super(props);

    UIEvents.addListener(NavDrawer.EVENT_CLOSE, this.setFocus);
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

    if (this.props.setFocus) {
      this.setFocus();
    }

    if (this.props.route.visible) {
      this.updateStatusBar();

      if (this.props.title) {
        const { __ } = this.context.i18n();
        router.update(this.props.route.id, { title: __(this.props.title) });
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

    if (routeDidEnter || engageDidEnter) {
      // Sync the colors of the app bar when the route with the bar came visible.
      this.updateStatusBar();
    }

    if (engageWillLeave) {
      // Reset the status bar when Engage goes into the background.
      this.props.resetStatusBar();
    }

    if (prevProps.title !== this.props.title) {
      const { __ } = this.context.i18n();
      router.update(this.props.route.id, { title: __(this.props.title) });
    }
  }

  /**
   * Removes the event listeners when the component unmounts.
   */
  componentWillUnmount() {
    UIEvents.addListener(NavDrawer.EVENT_CLOSE, this.setFocus);
  }

  /**
   * Sets the a11y focus to the first focusable element within the AppBar.
   */
  setFocus = () => {
    const { target } = this.state;

    if (!target) {
      return;
    }

    // Set the focus to the first focusable element for screen readers.
    const focusable = target.querySelector('button:not([aria-hidden="true"]), [tabindex]:not([tabindex="-1"])');

    if (focusable) {
      focusable.focus();
    }
  }

  /**
   * Maintains the status bar based on the visibility of the global SearchComponent.
   * @param {bool} visible The current state.
   */
  toggleSearch = (visible) => {
    if (!this.props.route.visible) {
      return;
    }

    if (visible) {
      this.props.resetStatusBar();
    } else {
      this.updateStatusBar();
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
     */
    this.props.updateStatusBar(this.props.widgetSettings, pathname === INDEX_PATH);
  }

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.props.route.visible || !this.state.target) {
      return null;
    }

    const { background, color } = this.props.widgetSettings;
    const { __ } = this.context.i18n();
    const left = <AppBarIcon icon={BurgerIcon} onClick={NavDrawer.open} testId="Button" aria-label={__('navigation.open_menu')} />;
    const center = <AppBar.Title title={__(this.props.title || '')} />;
    const right = (
      <Fragment>
        <SearchButton onToggle={this.toggleSearch} />
        <CartButton />
      </Fragment>
    );

    const below = (
      <Fragment>
        {this.props.below}
        <ProgressBar />
      </Fragment>
    );

    return ReactDOM.createPortal(
      <Fragment>
        <Portal name={APP_BAR_DEFAULT_BEFORE} />
        <Portal name={APP_BAR_DEFAULT}>
          <AppBar
            backgroundColor={background}
            textColor={color}
            left={left}
            center={center}
            right={right}
            {...this.props}
            below={below}
            aria-hidden={this.props['aria-hidden']}
          />
        </Portal>
        <Portal name={APP_BAR_DEFAULT_AFTER} />
      </Fragment>,
      this.state.target
    );
  }
}

/**
 * The AppBarDefaultWithContext component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AppBarDefaultWithContext = props => (
  <ViewContext.Consumer>
    {({ ariaHidden }) => (
      <AppBarDefault {...props} aria-hidden={ariaHidden} />
    )}
  </ViewContext.Consumer>
);

const WrappedComponent = withApp(withWidgetSettings(
  withRoute(connect(AppBarDefaultWithContext), { prop: 'route' }),
  '@shopgate/engage/components/AppBar'
));

WrappedComponent.Icon = AppBarIcon;

export default WrappedComponent;
