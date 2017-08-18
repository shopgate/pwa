import React, { PropTypes } from 'react';
// import { Navigator, NavDrawer } from 'Templates/components';
import styles from './style';

/**
 * The viewport component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Viewport = props => (
  <main className={styles} role="main" itemScope itemProp="http://schema.org/MobileApplication">
    {/* <Navigator />
    <NavDrawer /> */}
    {props.children}
  </main>
);

Viewport.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Viewport;
