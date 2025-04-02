import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { UIEvents } from '@shopgate/pwa-core';
import {
  Grid, Portal, KeyboardConsumer, MODAL_EVENTS,
} from '@shopgate/engage/components';
import getTabActionComponentForType, { tabs } from './helpers/getTabActionComponentForType';
import {
  TAB_BAR,
  TAB_BAR_BEFORE,
  TAB_BAR_AFTER,
  SHOW_TAB_BAR,
  HIDE_TAB_BAR,
} from './constants';
import connect from './connector';
import styles, {
  updateHeightCSSProperty, inVisible, scrolledIn, scrolledOut,
} from './style';
import visibleTabs from './tabs';
import ScrollTabBar from './ScrollTabBar';

/**
 * Renders the action for a given tab configuration.
 * @param {Object} tab The tab configuration.
 * @param {boolean} isHighlighted Whether the tab is currently highlighted.
 * @param {string} path The current history path.
 * @returns {JSX}
 */
const createTabAction = (tab, isHighlighted, path) => {
  const Action = getTabActionComponentForType(tab.type);

  return (
    <Action
      key={tab.type}
      {...tab}
      isHighlighted={isHighlighted}
      path={path}
    />
  );
};

/**
 * The TabBar component
 */
class TabBar extends PureComponent {
  /**
   * Shows tha TabBar
   * @param {boolean} [force=false] When set to TRUE the TabBar wil be shown even if not enabled
   */
  static show = (force = false) => {
    UIEvents.emit(SHOW_TAB_BAR, { force });
  }

  static hide = () => {
    UIEvents.emit(HIDE_TAB_BAR);
  }

  static propTypes = {
    path: PropTypes.string.isRequired,
    activeTab: PropTypes.string,
    isEnabled: PropTypes.bool,
    isVisible: PropTypes.bool,
  };

  static defaultProps = {
    activeTab: null,
    isVisible: true,
    isEnabled: true,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    updateHeightCSSProperty(props.isVisible);
    UIEvents.addListener(SHOW_TAB_BAR, this.show);
    UIEvents.addListener(HIDE_TAB_BAR, this.hide);

    // Listen to the modal events to toggle the aria-hidden attribute of the tab bar
    // when a modal is shown or hidden.
    UIEvents.addListener(MODAL_EVENTS.SHOW, this.ariaHide);
    UIEvents.addListener(MODAL_EVENTS.HIDE, this.ariaShow);
  }

  state = {
    isVisible: this.props.isVisible,
    isScrolledOut: false,
    ariaHidden: false,
  };

  /**
   * @param {Object} nextProps next props
   */
  UNSAFE_componentWillReceiveProps({ isVisible }) {
    if (this.state.isVisible !== isVisible) {
      this.setState({ isVisible });
    }
  }

  /**
   * it's responsible to update the css height property of the tabbar
   * @param {Object} prevProps previous props
   * @param {Object} prevState previous state
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.state.isVisible !== prevState.isVisible) {
      updateHeightCSSProperty(this.state.isVisible);
    }
  }

  /** Will unmount hook */
  componentWillUnmount() {
    UIEvents.removeListener(SHOW_TAB_BAR, this.show);
    UIEvents.removeListener(HIDE_TAB_BAR, this.hide);

    UIEvents.removeListener(MODAL_EVENTS.SHOW, this.ariaHide);
    UIEvents.removeListener(MODAL_EVENTS.HIDE, this.ariaShow);

    updateHeightCSSProperty(false);
  }

  show = ({ scroll, force } = {}) => {
    // Don't show the TabBar when it's not enabled
    if (!this.props.isEnabled && force !== true) {
      return;
    }

    if (scroll === true) {
      this.setState({
        isScrolledOut: false,
      }, () => {
        updateHeightCSSProperty(true);
      });
      return;
    }
    this.setState({
      isVisible: true,
    });
  }

  hide = ({ scroll } = {}) => {
    if (scroll === true) {
      this.setState({
        isScrolledOut: true,
      }, () => {
        updateHeightCSSProperty(false);
      });
      return;
    }
    this.setState({
      isVisible: false,
    });
  }

  ariaHide = () => {
    this.setState({
      ariaHidden: true,
    });
  }

  ariaShow = () => {
    this.setState({
      ariaHidden: false,
    });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { activeTab, path } = this.props;
    const { isVisible, isScrolledOut, ariaHidden } = this.state;

    const props = {
      isVisible,
      activeTab,
      path,
    };

    const className = classNames('theme__tab-bar', styles,
      isScrolledOut ? scrolledOut : scrolledIn,
      {
        [inVisible]: !isVisible,
      });

    return (
      <>
        <KeyboardConsumer>
          {({ open }) => !open && (
          <Fragment>
            <Portal name={TAB_BAR_BEFORE} props={{ ...props }} />
            {/* eslint-disable-next-line extra-rules/no-single-line-objects */}
            <Portal name={TAB_BAR} props={{ tabs: { ...tabs }, ...props }}>
              <Grid
                className={className}
                data-test-id="tabBar"
                role="tablist"
                component="div"
                aria-hidden={ariaHidden}
              >
                {visibleTabs.map(tab => createTabAction(tab, activeTab === tab.type, path))}
              </Grid>
            </Portal>
            <Portal name={TAB_BAR_AFTER} props={{ ...props }} />
          </Fragment>
          )}
        </KeyboardConsumer>
        <ScrollTabBar />
      </>
    );
  }
}

export default connect(TabBar);
