import React, {
  Fragment, useState, useEffect, useRef, memo, useContext,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_DEFAULT_BEFORE,
  APP_BAR_DEFAULT,
  APP_BAR_DEFAULT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { AppBar } from '@shopgate/pwa-ui-ios';
import {
  withRoute, withWidgetSettings, withApp, INDEX_PATH, router, i18n,
} from '@shopgate/engage/core';
import { ViewContext } from '@shopgate/engage/components/View';
import AppBarIcon from './components/Icon';
import ProgressBar from './components/ProgressBar';
import connect from './connector';

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
  } = props;

  const [target, setTarget] = useState(() => document.getElementById('AppHeader'));
  const prevRouteVisibleRef = useRef(route.visible);
  const prevAppVisibleRef = useRef(app.isVisible);
  const prevTitleRef = useRef(title);

  useEffect(() => {
    let nextTarget = target;
    if (!nextTarget) {
      nextTarget = document.getElementById('AppHeader') || null;
      setTarget(nextTarget);
    }

    if (shouldSetFocusOnMount && nextTarget) {
      const focusable = nextTarget.querySelector('.theme__app-bar__title')
        || nextTarget.querySelector(
          'button:not([aria-hidden="true"]), [tabindex]:not([tabindex="-1"])'
        );
      if (focusable) {
        focusable.focus();
      }
    }

    if (route.visible) {
      const { pathname } = route;
      updateStatusBarAction(widgetSettings, pathname === INDEX_PATH);

      if (title && route.state.title !== title) {
        router.update(route.id, { title: i18n.text(title) });
      }
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * mount: DOM target + initial status bar only */
  }, []);

  useEffect(() => {
    if (!route.visible) {
      prevRouteVisibleRef.current = route.visible;
      prevAppVisibleRef.current = app.isVisible;
      prevTitleRef.current = title;
      return;
    }

    const routeDidEnter =
      prevRouteVisibleRef.current === false && route.visible === true;
    const engageDidEnter =
      prevAppVisibleRef.current === false && app.isVisible === true;
    const engageWillLeave =
      prevAppVisibleRef.current === true && app.isVisible === false;

    if (routeDidEnter || engageDidEnter) {
      const { pathname } = route;
      updateStatusBarAction(widgetSettings, pathname === INDEX_PATH);
    }

    if (engageWillLeave) {
      resetStatusBar();
    }

    if (prevTitleRef.current !== title && route.state.title !== title) {
      router.update(route.id, { title: i18n.text(title || '') });
    }

    prevRouteVisibleRef.current = route.visible;
    prevAppVisibleRef.current = app.isVisible;
    prevTitleRef.current = title;
  }, [
    app.isVisible,
    resetStatusBar,
    route,
    title,
    updateStatusBarAction,
    widgetSettings,
  ]);

  if (!route.visible || !target) {
    return null;
  }

  const { background, color } = widgetSettings;
  const center = <AppBar.Title title={i18n.text(title || '')} />;
  const belowContent = (
    <Fragment key="below">
      {below}
      <ProgressBar />
    </Fragment>
  );

  return ReactDOM.createPortal(
    <>
      <Portal name={APP_BAR_DEFAULT_BEFORE} />
      <Portal name={APP_BAR_DEFAULT}>
        <AppBar
          backgroundColor={background}
          textColor={color}
          center={center}
          {...props}
          below={belowContent}
          aria-hidden={ariaHidden}
        />
      </Portal>
      <Portal name={APP_BAR_DEFAULT_AFTER} />
    </>,
    target
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
  below: null,
  title: null,
};

const WrappedComponent = withApp(withWidgetSettings(
  withRoute(connect(memo(AppBarDefault)), { prop: 'route' }),
  '@shopgate/engage/components/AppBar'
));

WrappedComponent.Icon = AppBarIcon;

export default WrappedComponent;
