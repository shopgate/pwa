import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import Navigator from 'Components/Navigator';
import NavDrawer from 'Components/NavDrawer';
import styles from './style';

/**
 * The Viewport component.
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
