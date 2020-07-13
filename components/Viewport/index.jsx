import React from 'react';
import PropTypes from 'prop-types';
import { Footer } from '@shopgate/engage/components';
import { GlobalLocationSelector } from '@shopgate/engage/locations';
import { LiveMessenger } from '@shopgate/engage/a11y';
import TabBar from 'Components/TabBar';
import styles from './style';

/**
 * The Viewport component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Viewport = props => (
  <main className={styles.viewport} role="main" itemScope itemProp="http://schema.org/MobileApplication">
    <LiveMessenger />
    <header className={styles.header} id="AppHeader" />
    <GlobalLocationSelector />
    <section className={styles.content}>
      {props.children}
    </section>
    <Footer>
      <TabBar />
    </Footer>
  </main>
);

Viewport.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Viewport;
