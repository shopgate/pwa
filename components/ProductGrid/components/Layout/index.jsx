import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import styles from './style';

/**
 * The Product Grid Layout component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Layout = ({ children }) => (
  <Grid wrap className={styles.container} itemScope itemType="http://schema.org/ItemList" data-test-id="productGrid">
    {children}
  </Grid>
);

Layout.propTypes = {
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
