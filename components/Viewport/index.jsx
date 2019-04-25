import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import Footer from '@shopgate/pwa-ui-shared/Footer';
import TabBar from 'Components/TabBar';
import styles from './style';

/**
 * The Viewport component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Viewport = props => (
  <main className={styles.viewport} role="main" itemScope itemProp="http://schema.org/MobileApplication">
    <header className={styles.header} id="AppHeader" />
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

/**
 * @param {Object} prev The previous component props.
 * @param {Object} next The next component props.
 * @return {boolean}
 */
function viewportShouldUpdate(prev, next) {
  if (!prev.children && next.children) {
    return true;
  }

  return false;
}

export default shouldUpdate(viewportShouldUpdate)(Viewport);
