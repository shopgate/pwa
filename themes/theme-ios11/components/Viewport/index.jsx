import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import {
  injectGlobal,
  makeStyles,
  responsiveMediaQuery,
  setPageContentWidth,
  setViewportHeight,
} from '@shopgate/engage/styles';
import {
  Footer,
  NavigationDrawer,
  ResponsiveContainer,
  WideBar,
} from '@shopgate/engage/components';
import { LiveMessenger } from '@shopgate/engage/a11y';
import { applyScrollContainer, hasWebBridge } from '@shopgate/engage/core/helpers';
import { isAdminPreviewActive } from '@shopgate/engage/admin-preview/helpers';
import { MAX_DESKTOP_WIDTH } from '@shopgate/engage/components/constants';
import TabBar from 'Components/TabBar';

injectGlobal({
  html: {
    '--page-background-color': 'var(--sg-palette-background-default)',
    '--tabbar-height': '0px',
    '--app-bar-height': '0px',
  },
});

const useStyles = makeStyles()({
  viewport: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    overflow: applyScrollContainer() ? 'hidden' : 'inherit',
    position: 'relative',
    // In the admin preview iframe (Safari) `100vw` includes the vertical scrollbar
    // width, overflowing the iframe body and producing spurious double scrollbars.
    width: isAdminPreviewActive() ? '100%' : '100vw',
  },
  content: {
    flexGrow: 1,
    position: 'relative',
    zIndex: 0,
    ...(hasWebBridge() ? {
      display: 'flex',
      justifyContent: 'center',
    } : {}),
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      margin: '0 auto',
      maxWidth: MAX_DESKTOP_WIDTH,
      width: '100%',
    },
  },
  header: {
    top: 0,
    flexShrink: 1,
    position: hasWebBridge() ? 'sticky' : 'relative',
    zIndex: 1,
    // The WideBar replaces the narrow app bar on wide website viewports.
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      display: 'none',
    },
  },
});

/**
 * Publishes the width the page content is actually rendered at.
 */
const updatePageContentWidth = () => {
  const { clientWidth } = document.body;

  setPageContentWidth(
    hasWebBridge() ? Math.min(clientWidth, MAX_DESKTOP_WIDTH) : clientWidth
  );
};

window.onresize = debounce(() => {
  updatePageContentWidth();
  setViewportHeight();
}, 200);

updatePageContentWidth();
setViewportHeight();

/**
 * The Viewport component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Viewport = (props) => {
  const { classes, cx } = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = useCallback(() => setDrawerOpen(true), []);
  const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      <ResponsiveContainer webOnly breakpoint=">xs">
        <NavigationDrawer onOpen={handleDrawerOpen} onClose={handleDrawerClose} />
      </ResponsiveContainer>
      <main
        className={cx(classes.viewport, 'theme__viewport')}
        role="main"
        itemScope
        itemProp="http://schema.org/MobileApplication"
        aria-hidden={drawerOpen}
      >
        <LiveMessenger />
        <ResponsiveContainer webOnly breakpoint=">xs">
          <WideBar />
        </ResponsiveContainer>
        <header className={classes.header} id="AppHeader" />
        <section className={classes.content} id="AppContent">
          {props.children}
        </section>
        <Footer>
          <TabBar />
        </Footer>
      </main>
    </>
  );
};

Viewport.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Viewport;
