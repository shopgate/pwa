import React, {
  useMemo, useEffect, useCallback, useState, useRef, memo,
} from 'react';
import PropTypes from 'prop-types';
import { KeyboardConsumer, SurroundPortals } from '@shopgate/engage/components';
import { UIEvents } from '@shopgate/engage/core/events';
import { makeStyles } from '@shopgate/engage/styles';
import { setCSSCustomProp } from '@shopgate/engage/styles/helpers';
import { isAndroidOs } from '@shopgate/engage/core/helpers';
import { useElementSize } from '@shopgate/engage/core/hooks';
import getTabActionComponentForType, { tabs } from './helpers/getTabActionComponentForType';
import {
  TAB_BAR,
  SHOW_TAB_BAR,
  HIDE_TAB_BAR,
} from './constants';
import connect from './connector';
import { useTabBarScrollObserver, useTabBarSettings } from './hooks';
import visibleTabs from './tabs';

const useStyles = makeStyles()(theme => ({
  hidden: {
    display: 'none !important',
  },
  tabBarContainerBase: {
    display: 'flex',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 10,
    justifyContent: 'center',
  },
  tabBarContainerFixed: {
    background: theme.components.tabBar.background,
    minHeight: `calc(${theme.components.tabBar.minHeight} + ${theme.layout.safeArea.bottom})`,
  },
  tabBarContainerBorder: {
    borderTop: `1px solid ${theme.components.tabBar.border}`,
  },
  tabBarContainerFloating: {
    padding: '0 16px',
  },
  tabBarBase: {
    display: 'flex',
    width: '100%',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabBarFixed: {
    paddingBottom: theme.layout.safeArea.bottom,
  },
  tabBarFloating: {
    background: theme.components.tabBar.background,
    minHeight: theme.components.tabBar.floatingMinHeight,
    padding: '4px 0',
    marginBottom: `max(16px, calc(${theme.layout.safeArea.bottom} + ${isAndroidOs ? '8px' : '0px'}))`,
    borderRadius: theme.components.tabBar.floatingBorderRadius,
    boxShadow: theme.components.tabBar.floatingBoxShadow,
  },
  transitionFadeBase: {
    transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
  },
  transitionFadeIn: {
    opacity: 1,
    visibility: 'visible',
    pointerEvents: 'auto',
  },
  transitionFadeOut: {
    opacity: 0,
    visibility: 'hidden',
    pointerEvents: 'none',
  },
  transitionSlideBase: {
    transition: 'transform 0.2s ease-in-out',
  },
  transitionSlideIn: {
    transform: 'translateY(0)',
  },
  transitionSlideOut: {
    transform: `translateY(calc(100% + ${theme.layout.safeArea.bottom} + 16px))`,
  },
}));

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
  const { classes, cx } = useStyles();
  useTabBarScrollObserver(isVisibleProp);

  const {
    transition = 'fade',
    variant = 'fixed',
    hideOnScroll = false,
    fixed: { borderEnabled = true } = {},
  } = useTabBarSettings();

  const [ariaHidden, setAriaHidden] = useState(modalCount > 0);
  const [isScrolledOut, setIsScrolledOut] = useState(false);
  const [isVisible, setIsVisible] = useState(isVisibleProp);
  const [transitionVisibility, setTransitionVisibility] = useState(true);

  const tabBarRef = useRef(null);

  const { height: tabBarHeight } = useElementSize(tabBarRef);

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

  const tabBarClasses = useMemo(() => {
    const transitionsMap = {
      fade: {
        base: classes.transitionFadeBase,
        in: classes.transitionFadeIn,
        out: classes.transitionFadeOut,
      },
      slide: {
        base: classes.transitionSlideBase,
        in: classes.transitionSlideIn,
        out: classes.transitionSlideOut,
      },
    };
    const transitionClasses = transitionsMap[transition] || transitionsMap.fade;

    const container = cx(
      'theme__tab-bar__container',
      classes.tabBarContainerBase,
      transitionClasses.base,
      `transition-${!hideOnScroll ? 'none' : transition}`,
      isScrolledOut ? transitionClasses.out : transitionClasses.in,
      isScrolledOut ? 'transition-hidden' : 'transition-visible',
      transitionVisibility ? 'visible' : 'hidden',
      {
        // 'variant-docked' is kept for backwards compatibility with custom
        // styling; 'variant-fixed' is the new vocabulary. Both are emitted.
        'variant-docked': variant !== 'floating',
        'variant-fixed': variant !== 'floating',
        'variant-floating': variant === 'floating',
        [classes.tabBarContainerFixed]: variant !== 'floating',
        [classes.tabBarContainerBorder]: variant !== 'floating' && borderEnabled,
        [classes.tabBarContainerFloating]: variant === 'floating',
        [classes.hidden]: !isVisible,
      }
    );

    const component = cx(
      'theme__tab-bar',
      // Backwards compatibility to prevent broken custom styling that addressed class of the Grid
      // component
      'common__grid',
      classes.tabBarBase,
      {
        [classes.tabBarFixed]: variant !== 'floating',
        [classes.tabBarFloating]: variant === 'floating',
      }
    );

    return {
      container,
      component,
    };
  }, [
    classes.hidden,
    classes.tabBarBase,
    classes.tabBarContainerBase,
    classes.tabBarContainerFixed,
    classes.tabBarContainerBorder,
    classes.tabBarContainerFloating,
    classes.tabBarFixed,
    classes.tabBarFloating,
    classes.transitionFadeBase,
    classes.transitionFadeIn,
    classes.transitionFadeOut,
    classes.transitionSlideBase,
    classes.transitionSlideIn,
    classes.transitionSlideOut,
    hideOnScroll,
    isScrolledOut,
    isVisible,
    transition,
    transitionVisibility,
    variant,
    borderEnabled,
    cx,
  ]);

  return (
    <KeyboardConsumer>
      {({ open }) => !open && (
        <SurroundPortals portalName={TAB_BAR} portalProps={portalProps}>
          <div
            className={tabBarClasses.container}
            aria-hidden={ariaHidden}
            onTransitionEnd={handleTransitionEnd}
            ref={tabBarRef}
          >
            <div
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
