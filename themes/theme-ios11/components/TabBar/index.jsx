import React, {
  useMemo, useEffect, useCallback, useState, useRef, memo,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { KeyboardConsumer, SurroundPortals } from '@shopgate/engage/components';
import { UIEvents } from '@shopgate/engage/core/events';
import { setCSSCustomProp } from '@shopgate/engage/styles/helpers';
import { useWidgetSettings } from '@shopgate/engage/core';
import getTabActionComponentForType, { tabs } from './helpers/getTabActionComponentForType';
import {
  TAB_BAR,
  SHOW_TAB_BAR,
  HIDE_TAB_BAR,
} from './constants';
import connect from './connector';
import { useTabBarScrollObserver } from './hooks';
import * as classes from './style';
import visibleTabs from './tabs';

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
 * @param {Object} props The component props.
 * @param {boolean} props.isEnabled If the tab bar is enabled.
 * @param {boolean} props.isVisible If the tab bar is visible.
 * @param {string} props.activeTab The active tab.
 * @param {string} props.path The current path.
 * @param {number} props.modalCount The current modal count.
 * @returns {JSX.Element}
 */
const TabBar = ({
  isEnabled,
  isVisible: isVisibleProp,
  activeTab,
  path,
  modalCount,
}) => {
  useTabBarScrollObserver(isVisibleProp);

  const {
    transition = 'fade',
    variant = 'docked',
    hideOnScroll = false,
  } = useWidgetSettings('@shopgate/engage/components/TabBar');

  const [tabBarHeight, setTabBarHeight] = useState(0);
  const [ariaHidden, setAriaHidden] = useState(modalCount > 0);
  const [isScrolledOut, setIsScrolledOut] = useState(false);
  const [isVisible, setIsVisible] = useState(isVisibleProp);
  const [transitionVisibility, setTransitionVisibility] = useState(true);

  const tabBarRef = useRef(null);

  // Effect to measure the tab bar height
  useEffect(() => {
    /**
     * Sets the CSS property for the tab bar height.
     */
    const measureTabBarHeight = () => {
      if (tabBarRef.current) {
        const rect = tabBarRef.current.getBoundingClientRect();
        const height = window.innerHeight - rect.top;
        setTabBarHeight(height);
      }
    };

    measureTabBarHeight();

    window.addEventListener('resize', measureTabBarHeight);
    return () => window.removeEventListener('resize', measureTabBarHeight);
  }, []);

  // Effect to maintain the aria-hidden attribute based on modal count
  useEffect(() => {
    setAriaHidden(modalCount > 0);
  }, [modalCount]);

  // Effect to update the visibility state of the tab bar
  useEffect(() => {
    setIsVisible(isVisibleProp);
  }, [isVisibleProp]);

  useEffect(() => {
    setTransitionVisibility(isVisible);
  }, [isVisible]);

  // Effect to update the CSS custom property for tab bar height
  useEffect(() => {
    const update = !isVisible || isScrolledOut ? 0 : tabBarHeight;
    // Set a global css variable that indicates the current height of the TabBar
    setCSSCustomProp('--tabbar-height', `${update}px`);
  }, [isScrolledOut, isVisible, tabBarHeight]);

  /**
   * Callback for the tab bar events invoked when the tab bar is shown.
   */
  const handleShow = useCallback(({ scroll, force } = {}) => {
    if (!isEnabled && force !== true) {
      return;
    }

    if (scroll === true) {
      setIsScrolledOut(false);
      return;
    }

    setIsVisible(true);
  }, [isEnabled]);

  /**
   * Callback for the tab bar events invoked when the tab bar is hidden.
   */
  const handleHide = useCallback(({ scroll } = {}) => {
    if (scroll === true) {
      setIsScrolledOut(true);
      return;
    }

    setIsVisible(false);
  }, []);

  // Effect to register the event listeners for showing and hiding the tab bar
  useEffect(() => {
    UIEvents.addListener(SHOW_TAB_BAR, handleShow);
    UIEvents.addListener(HIDE_TAB_BAR, handleHide);

    return () => {
      UIEvents.removeListener(SHOW_TAB_BAR, handleShow);
      UIEvents.removeListener(HIDE_TAB_BAR, handleHide);
    };
  }, [handleHide, handleShow]);

  // Create props for the portals
  const portalProps = useMemo(() => ({
    tabs: { ...tabs },
    isVisible,
    activeTab,
    path,
  }), [activeTab, isVisible, path]);

  // Callback invoked when the animated tab bar transition ends
  const handleTransitionEnd = useCallback(() => {
    setTransitionVisibility(!isScrolledOut);
  }, [isScrolledOut]);

  // Pick classes for the configured transition
  const transitionClasses = useMemo(() => {
    if (Object.keys(classes.transitions).includes(transition)) {
      return classes.transitions[transition];
    }

    return classes.transitions.fade;
  }, [transition]);

  const tabBarClasses = useMemo(() => {
    // Create class list for the tab bar container
    const container = classNames(
      'theme__tab-bar__container',
      classes.tabBarContainer,
      transitionClasses.base,
      `transition-${hideOnScroll ? 'none' : transition}`,
      isScrolledOut ? transitionClasses.out : transitionClasses.in,
      isScrolledOut ? 'transition-hidden' : 'transition-visible',
      transitionVisibility ? 'visible' : 'hidden',
      {
        [classes.tabBarContainerFloating]: variant === 'floating',
        [classes.hidden]: !isVisible,
      }
    );

    // Create class list for the actual tab bar
    const component = classNames(
      'theme__tab-bar',
      // Backwards compatibility to prevent broken custom styling that addressed class of the Grid
      // component
      'common__grid',
      classes.tabBar,
      {
        [classes.tabBarFloating]: variant === 'floating',
      }
    );

    return {
      container,
      component,
    };
  }, [
    isScrolledOut,
    isVisible,
    hideOnScroll,
    transition,
    transitionClasses.base,
    transitionClasses.in,
    transitionClasses.out,
    transitionVisibility,
    variant,
  ]);

  return (
    <KeyboardConsumer>
      {({ open }) => !open && (
      <SurroundPortals portalName={TAB_BAR} portalProps={portalProps}>
        <div className={tabBarClasses.container} onTransitionEnd={handleTransitionEnd}>
          <div
            ref={tabBarRef}
            className={tabBarClasses.component}
            data-test-id="tabBar"
            role="tablist"
            aria-hidden={ariaHidden}
          >
            {visibleTabs.map(tab => createTabAction(tab, activeTab === tab.type, path))}
          </div>
        </div>
      </SurroundPortals>
      )}
    </KeyboardConsumer>
  );
};

TabBar.propTypes = {
  modalCount: PropTypes.number.isRequired,
  path: PropTypes.string.isRequired,
  activeTab: PropTypes.string,
  isEnabled: PropTypes.bool,
  isVisible: PropTypes.bool,
};

TabBar.defaultProps = {
  activeTab: null,
  isVisible: true,
  isEnabled: true,
};

const ConnectedTabBar = connect(memo(TabBar));

/**
 * Shows the TabBar
 * @param {boolean} [force=false] When set to TRUE the TabBar wil be shown even if not enabled
 */
ConnectedTabBar.show = (force = false) => {
  UIEvents.emit(SHOW_TAB_BAR, { force });
};

/**
 * Hides the TabBar
 */
ConnectedTabBar.hide = () => {
  UIEvents.emit(HIDE_TAB_BAR);
};

export default ConnectedTabBar;
