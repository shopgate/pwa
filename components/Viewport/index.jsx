import React from 'react';
import PropTypes from 'prop-types';
import Navigator from 'Components/Navigator';
import TabBar from 'Components/TabBar';
import styles from './style';

/**
 * The viewport component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Viewport = props => (
  <main className={styles} role="main" itemScope itemProp="http://schema.org/MobileApplication">
    <Navigator />
    {props.children}
    <TabBar />
  </main>
);

Viewport.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Viewport;
