import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  memo,
  useContext,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { AppBar, NavDrawer } from '@shopgate/pwa-ui-material';
import { BurgerIcon } from '@shopgate/pwa-ui-shared';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_DEFAULT_BEFORE,
  APP_BAR_DEFAULT,
  APP_BAR_DEFAULT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import {
  withRoute, withWidgetSettings, withApp, INDEX_PATH, router, UIEvents, i18n,
} from '@shopgate/engage/core';
import {
  ViewContext,
  ResponsiveContainer,
} from '@shopgate/engage/components';
import AppBarIcon from './components/Icon';
import CartButton from './components/CartButton';
import SearchButton from './components/SearchButton';
import ProgressBar from './components/ProgressBar';
import connect from './connector';

const useBarButtonsStyles = makeStyles()({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
});

/**
 * Right-side app bar actions container.
 * @param {Object} props Props.
 * @param {React.ReactNode} props.children Child nodes.
 * @returns {JSX.Element}
 */
const BarButtons = ({ children }) => {
  const { classes } = useBarButtonsStyles();
  return <div className={classes.root}>{children}</div>;
};

BarButtons.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * The AppBarDefault component.
 * @param {Object} props The component properties.
 * @returns {JSX.Element|null}
 */
const AppBarDefault = (props) => {
  const { ariaHidden } = useContext(ViewContext);
  const {
    app,
    resetStatusBar,
    route,
    setFocus: shouldSetFocusOnMount,
    updateStatusBar: updateStatusBarAction,
    widgetSettings,
    below,
    title,
    ...restProps
  } = props;

  const [target, setTarget] = useState(() => document.getElementById('AppHeader'));
  const [pageHeaderTarget, setPageHeaderTarget] = useState(
    () => document.getElementById('PageHeaderBelow')
  );
  const [pageHeaderProgressTarget, setPageHeaderProgressTarget] = useState(
    () => document.getElementById('PageHeaderProgress')
  );

  const prevRouteVisibleRef = useRef(route.visible);
  const prevAppVisibleRef = useRef(app.isVisible);
  const prevTitleRef = useRef(title);

  const setFocus = useCallback(() => {
    if (!target) {
      return;
    }

    const focusable = target.querySelector('.theme__app-bar__title')
      || target.querySelector('button:not([aria-hidden="true"]), [tabindex]:not([tabindex="-1"])');

    if (focusable) {
      focusable.focus();
    }
  }, [target]);

  const updateStatusBar = useCallback(() => {
    const { pathname } = route;
    /**
     * The settings for the startpage need to be preserved within the statusbar to optimize
     * the initial rendering at the app start.
     */
    updateStatusBarAction(widgetSettings, pathname === INDEX_PATH);
  }, [route, updateStatusBarAction, widgetSettings]);

  const toggleSearch = useCallback((visible) => {
    if (!route.visible) {
      return;
    }

    if (visible) {
      resetStatusBar();
    } else {
      updateStatusBar();
    }
  }, [route.visible, resetStatusBar, updateStatusBar]);

  useEffect(() => {
    UIEvents.addListener(NavDrawer.EVENT_CLOSE, setFocus);
    return () => {
      UIEvents.removeListener(NavDrawer.EVENT_CLOSE, setFocus);
    };
  }, [setFocus]);

  useLayoutEffect(() => {
    let nextTarget = target;
    if (!nextTarget) {
      nextTarget = document.getElementById('AppHeader') || null;
      setTarget(nextTarget);
    }

    setPageHeaderTarget(document.getElementById('PageHeaderBelow') || null);
    setPageHeaderProgressTarget(document.getElementById('PageHeaderProgress') || null);

    if (shouldSetFocusOnMount && nextTarget) {
      const focusable = nextTarget.querySelector('.theme__app-bar__title')
        || nextTarget.querySelector(
          'button:not([aria-hidden="true"]), [tabindex]:not([tabindex="-1"])'
        );
      focusable?.focus();
    }

    if (route.visible) {
      updateStatusBar();

      if (title && route.state.title !== title) {
        router.update(route.id, { title: i18n.text(title) });
      }
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps -- mount / initial DOM targets only */
  }, []);

  useLayoutEffect(() => {
    if (!route.visible) {
      prevRouteVisibleRef.current = route.visible;
      prevAppVisibleRef.current = app.isVisible;
      prevTitleRef.current = title;
      return;
    }

    const nextPageHeaderBelow = document.getElementById('PageHeaderBelow') || null;
    if (pageHeaderTarget !== nextPageHeaderBelow) {
      setPageHeaderTarget(nextPageHeaderBelow);
    }

    const routeDidEnter =
      prevRouteVisibleRef.current === false && route.visible === true;
    const engageDidEnter =
      prevAppVisibleRef.current === false && app.isVisible === true;
    const engageWillLeave =
      prevAppVisibleRef.current === true && app.isVisible === false;

    if (routeDidEnter || engageDidEnter) {
      updateStatusBar();
    }

    if (engageWillLeave) {
      resetStatusBar();
    }

    if (prevTitleRef.current !== title) {
      router.update(route.id, { title: i18n.text(title || '') });
    }

    prevRouteVisibleRef.current = route.visible;
    prevAppVisibleRef.current = app.isVisible;
    prevTitleRef.current = title;
  }, [
    app.isVisible,
    pageHeaderTarget,
    resetStatusBar,
    route.id,
    route.visible,
    title,
    updateStatusBar,
  ]);

  if (!route.visible || !target) {
    return null;
  }

  const { background, color } = widgetSettings;
  const left = (
    <AppBarIcon
      icon={BurgerIcon}
      onClick={NavDrawer.open}
      testId="Button"
      aria-label={i18n.text('navigation.open_menu')}
    />
  );
  const center = <AppBar.Title title={i18n.text(title || '')} />;
  const right = (
    <BarButtons>
      <SearchButton onToggle={toggleSearch} />
      <CartButton />
    </BarButtons>
  );

  const belowContent = (
    <>
      {below}
      <ProgressBar />
    </>
  );

  const appBar = (
    <AppBar
      backgroundColor={background}
      textColor={color}
      left={left}
      center={center}
      right={right}
      {...restProps}
      below={belowContent}
      aria-hidden={ariaHidden}
    />
  );

  const appBarPortal = ReactDOM.createPortal(
    <>
      <Portal name={APP_BAR_DEFAULT_BEFORE} />
      <Portal name={APP_BAR_DEFAULT}>
        {appBar}
      </Portal>
      <Portal name={APP_BAR_DEFAULT_AFTER} />
    </>,
    target
  );

  return (
    <>
      <ResponsiveContainer appAlways breakpoint="<=xs">
        {appBarPortal}
      </ResponsiveContainer>
      <ResponsiveContainer webOnly breakpoint=">xs">
        {pageHeaderTarget ? ReactDOM.createPortal(
          below,
          pageHeaderTarget
        ) : null}
        {pageHeaderProgressTarget ? ReactDOM.createPortal(
          <ProgressBar />,
          pageHeaderProgressTarget
        ) : null}
      </ResponsiveContainer>
    </>
  );
};

AppBarDefault.propTypes = {
  app: PropTypes.shape().isRequired,
  resetStatusBar: PropTypes.func.isRequired,
  route: PropTypes.shape().isRequired,
  setFocus: PropTypes.bool.isRequired,
  updateStatusBar: PropTypes.func.isRequired,
  widgetSettings: PropTypes.shape().isRequired,
  below: PropTypes.node,
  title: PropTypes.string,
};

AppBarDefault.defaultProps = {
  title: null,
  below: null,
};

const WrappedComponent = withApp(withWidgetSettings(
  withRoute(connect(memo(AppBarDefault)), { prop: 'route' }),
  '@shopgate/engage/components/AppBar'
));

WrappedComponent.Icon = AppBarIcon;

export default WrappedComponent;
