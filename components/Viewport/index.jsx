import React from 'react';
import PropTypes from 'prop-types';
import Navigator from 'Components/Navigator';
import NavDrawer from 'Components/NavDrawer';
import styles from './style';

/**
 * The viewport component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Viewport = props => (
  <main className={styles} role="main" itemScope itemProp="http://schema.org/MobileApplication">
    <Navigator />
    <NavDrawer />
    {props.children}
  </main>
);

Viewport.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Viewport;
