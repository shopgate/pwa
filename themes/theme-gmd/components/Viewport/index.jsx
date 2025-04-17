import React, { useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import Helmet from 'react-helmet';
import { Footer, ResponsiveContainer } from '@shopgate/engage/components';
import DevOnlySimulatedInsets from '@shopgate/engage/components/DevOnlySimulatedInsets';
import { hasWebBridge } from '@shopgate/engage/core';
import { setPageContentWidth, setViewportHeight } from '@shopgate/engage/styles';
import { LiveMessenger, Navigation } from '@shopgate/engage/a11y';
import NavDrawer from 'Components/NavDrawer';
import Search from 'Components/Search';
import WideBar from 'Components/AppBar/presets/DefaultBar/components/WideBar';
import { a11yNavEntries } from './constants';
import styles from './style';
import { MAX_DESKTOP_WIDTH, DESKTOP_MENU_BAR_WIDTH } from '../../constants';
import connect from './connector';

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
      <div className={`${styles.viewport} theme__viewport`} aria-hidden={hidden} tabIndex="-1">
        <LiveMessenger />
        <DevOnlySimulatedInsets>
          <header className={styles.header} id="AppHeader">
            <ResponsiveContainer webOnly breakpoint=">xs">
              <WideBar
                backgroundColor="#fff"
                textColor="#000"
              />
            </ResponsiveContainer>
          </header>
          <section className={styles.content} id="AppContent">
            {children}
          </section>
          <Footer />
        </DevOnlySimulatedInsets>
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
