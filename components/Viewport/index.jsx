import React, { useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Footer, ResponsiveContainer } from '@shopgate/engage/components';
import { hasWebBridge } from '@shopgate/engage/core';
import { setPageContentWidth, setViewportHeight } from '@shopgate/engage/styles';
import { GlobalLocationSelector } from '@shopgate/engage/locations';
import { LiveMessenger, Navigation } from '@shopgate/engage/a11y';
import NavDrawer from 'Components/NavDrawer';
import Search from 'Components/Search';
import WideBar from 'Components/AppBar/presets/DefaultBar/components/WideBar';
import { a11yNavEntries } from './constants';
import styles from './style';
import { MAX_DESKTOP_WIDTH, DESKTOP_MENU_BAR_WIDTH } from '../../constants';

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
}, 500);

window.onresize = debounce(() => {
  setViewportHeight();
}, 200);

updatePageContent();
setViewportHeight();

/**
 * The Viewport component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Viewport = (props) => {
  const [hidden, setHidden] = useState(false);
  return (
    <main role="main" itemScope itemProp="http://schema.org/MobileApplication">
      <NavDrawer onOpen={() => setHidden(true)} onClose={() => setHidden(false)} />
      <div className={styles.viewport} aria-hidden={hidden} tabIndex="-1">
        <LiveMessenger />
        <header className={styles.header} id="AppHeader">
          <ResponsiveContainer webOnly breakpoint=">xs">
            <WideBar
              backgroundColor="#fff"
              textColor="#000"
            />
          </ResponsiveContainer>
        </header>
        <GlobalLocationSelector />
        <section className={styles.content} id="AppContent">
          {props.children}
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
};

export default Viewport;
