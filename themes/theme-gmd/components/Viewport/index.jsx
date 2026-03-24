import React, { useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import Helmet from 'react-helmet';
import { Footer, ResponsiveContainer } from '@shopgate/engage/components';
import { hasWebBridge, useScrollContainer } from '@shopgate/engage/core';
import {
  makeStyles,
  responsiveMediaQuery,
  setPageContentWidth,
  setViewportHeight,
} from '@shopgate/engage/styles';
import { insertGlobalRule } from '@shopgate/engage/styles/utils/globalStyles';
import { LiveMessenger, Navigation } from '@shopgate/engage/a11y';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import NavDrawer from 'Components/NavDrawer';
import Search from 'Components/Search';
import WideBar from 'Components/AppBar/presets/DefaultBar/components/WideBar';
import { a11yNavEntries } from './constants';
import { MAX_DESKTOP_WIDTH, DESKTOP_MENU_BAR_WIDTH } from '../../constants';
import connect from './connector';

const { colors } = themeConfig;
const defaultBackgroundColor = colors.background;

insertGlobalRule('html', {
  '--page-background-color': defaultBackgroundColor,
  '--tabbar-height': '0px',
  '--app-bar-height': '0px',
});

const useStyles = makeStyles()({
  viewport: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    overflow: useScrollContainer() ? 'hidden' : 'inherit',
    position: 'relative',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      width: '100vw',
    },
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
      boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.2), 0px 3px 1px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14)',
      margin: 'auto',
    },
  },
  header: {
    top: 0,
    flexShrink: 1,
    position: 'sticky',
    zIndex: 1,
  },
});

/**
 * Updates the page content width css variable
 */
const updatePageContent = () => {
  const { clientWidth } = document.querySelector('body');
  if (!hasWebBridge()) {
    setPageContentWidth(clientWidth);
    return;
  }

  const availableSpace = clientWidth > MAX_DESKTOP_WIDTH
    ? MAX_DESKTOP_WIDTH
    : clientWidth;

  const hasMenuBar = clientWidth >= 600;
  const pageContentWidth = availableSpace - (hasMenuBar ? DESKTOP_MENU_BAR_WIDTH : 0);
  setPageContentWidth(pageContentWidth);
};

window.onresize = debounce(() => {
  updatePageContent();
  setViewportHeight();
}, 300);

updatePageContent();
setViewportHeight();

/**
 * The Viewport component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Viewport = ({
  children, enableWebIndexing, favicon, googleSiteVerificationCode,
}) => {
  const { classes } = useStyles();
  const [hidden, setHidden] = useState(false);

  return (
    <main role="main" itemScope itemProp="http://schema.org/MobileApplication">
      { hasWebBridge() && (
        <Helmet>
          { !enableWebIndexing && (
            <meta name="robots" content="noindex, nofollow" />
          )}
          { googleSiteVerificationCode && (
            <meta name="google-site-verification" content={googleSiteVerificationCode} />
          )}
          { favicon && (
            <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
          )}
        </Helmet>
      )}
      <NavDrawer onOpen={() => setHidden(true)} onClose={() => setHidden(false)} />
      <div className={`${classes.viewport} theme__viewport`} aria-hidden={hidden} tabIndex="-1">
        <LiveMessenger />
        <header className={classes.header} id="AppHeader">
          <ResponsiveContainer webOnly breakpoint=">xs">
            <WideBar
              backgroundColor="#fff"
              textColor="#000"
            />
          </ResponsiveContainer>
        </header>
        <section className={classes.content} id="AppContent">
          {children}
        </section>
        <Footer />
        <Search />
        <Navigation entries={a11yNavEntries} />
      </div>
    </main>
  );
};

Viewport.propTypes = {
  children: PropTypes.node.isRequired,
  enableWebIndexing: PropTypes.bool,
  favicon: PropTypes.string,
  googleSiteVerificationCode: PropTypes.string,
};

Viewport.defaultProps = {
  enableWebIndexing: false,
  favicon: null,
  googleSiteVerificationCode: null,
};

export default connect(Viewport);
