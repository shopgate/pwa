import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { setViewportHeight } from '@shopgate/engage/styles';
import { Footer } from '@shopgate/engage/components';
import DevOnlySimulatedInsets from '@shopgate/engage/components/DevOnlySimulatedInsets';
import { LiveMessenger } from '@shopgate/engage/a11y';
import TabBar from 'Components/TabBar';
import styles from './style';

window.onresize = debounce(() => {
  setViewportHeight();
}, 200);

setViewportHeight();

/**
 * The Viewport component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Viewport = props => (
  <main className={`${styles.viewport} theme__viewport`} role="main" itemScope itemProp="http://schema.org/MobileApplication">
    <LiveMessenger />
    <DevOnlySimulatedInsets>
      <header className={styles.header} id="AppHeader" />
      <section className={styles.content} id="AppContent">
        {props.children}
      </section>
      <Footer>
        <TabBar />
      </Footer>
    </DevOnlySimulatedInsets>
  </main>
);

Viewport.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Viewport;
