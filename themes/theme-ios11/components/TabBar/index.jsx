import React, {
  useMemo, useEffect, useCallback, useState, useRef, memo,
} from 'react';
import PropTypes from 'prop-types';
import { KeyboardConsumer, SurroundPortals } from '@shopgate/engage/components';
import { UIEvents } from '@shopgate/engage/core/events';
import { injectGlobal, makeStyles } from '@shopgate/engage/styles';
import { setCSSCustomProp } from '@shopgate/engage/styles/helpers';
import { isAndroidOs } from '@shopgate/engage/core/helpers';
import { useWidgetSettings, useElementSize } from '@shopgate/engage/core/hooks';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import getTabActionComponentForType, { tabs } from './helpers/getTabActionComponentForType';
import {
  TAB_BAR,
  SHOW_TAB_BAR,
  HIDE_TAB_BAR,
} from './constants';
import connect from './connector';
import { useTabBarScrollObserver } from './hooks';
import visibleTabs from './tabs';

const { colors, shadows, variables } = themeConfig;

injectGlobal({
  ':root': {
    '--tab-bar-background': colors.lightOverlay,
    '--tab-bar-box-shadow': shadows.tabBar,
    '--tab-bar-min-height': `${variables.tabBar.height}px`,

    '--tab-bar-floating-border-radius': '16px',
    '--tab-bar-floating-box-shadow': '0 0 12px rgba(0, 0, 0, 0.24)',
    '--tab-bar-floating-min-height': '59px',

    '--tab-bar-item-default-color': colors.shade11,
    '--tab-bar-item-highlighted-color': 'var(--color-secondary)',

    '--tab-bar-item-badge-color': 'var(--color-secondary-contrast)',
    '--tab-bar-item-badge-background': 'var(--color-secondary)',
    '--tab-bar-item-badge-border-radius': `${variables.gap.small}px`,
    '--tab-bar-item-badge-top': `-${variables.gap.small}px`,
    '--tab-bar-item-badge-left': 'calc(50% + 20px)',
  },
});

const useStyles = makeStyles()({
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
  tabBarContainerDocked: {
    background: 'var(--tab-bar-background)',
    minHeight: 'calc(var(--tab-bar-min-height) + var(--safe-area-inset-bottom))',
    boxShadow: 'var(--tab-bar-box-shadow)',
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
  tabBarDocked: {
    paddingBottom: 'var(--safe-area-inset-bottom)',
  },
  tabBarFloating: {
    background: 'var(--tab-bar-background)',
    minHeight: 'var(--tab-bar-floating-min-height)',
    padding: '4px 0',
    marginBottom: `max(16px, calc(var(--safe-area-inset-bottom) + ${isAndroidOs ? '8px' : '0px'}))`,
    borderRadius: 'var(--tab-bar-floating-border-radius)',
    boxShadow: 'var(--tab-bar-floating-box-shadow)',
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
    transform: 'translateY(calc(100% + var(--safe-area-inset-bottom) + 16px))',
  },
});

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
    variant = 'docked',
    hideOnScroll = false,
  } = useWidgetSettings('@shopgate/engage/components/TabBar');

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
        'variant-docked': variant !== 'floating',
        'variant-floating': variant === 'floating',
        [classes.tabBarContainerDocked]: variant !== 'floating',
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
        [classes.tabBarDocked]: variant !== 'floating',
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
    classes.tabBarContainerDocked,
    classes.tabBarContainerFloating,
    classes.tabBarDocked,
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
