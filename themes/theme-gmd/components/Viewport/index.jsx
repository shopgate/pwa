import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Footer } from '@shopgate/engage/components';
import { setPageContentWidth } from '@shopgate/engage/styles';
import { LiveMessenger, Navigation } from '@shopgate/engage/a11y';
import NavDrawer from 'Components/NavDrawer';
import Search from 'Components/Search';
import { a11yNavEntries } from './constants';
import styles from './style';
import { MAX_DESKTOP_WIDTH, DESKTOP_MENU_BAR_WIDTH } from '../../constants';

// Sets the inner content width (web only).
const availableSpace = window.innerWidth > MAX_DESKTOP_WIDTH
  ? MAX_DESKTOP_WIDTH
  : window.innerWidth;
const pageContentWidth = availableSpace - DESKTOP_MENU_BAR_WIDTH;
setPageContentWidth(pageContentWidth);

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
        <header className={styles.header} id="AppHeader" />
        <section className={styles.content}>
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
