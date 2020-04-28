import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import { styles } from './style';

/**
 * The product grid layout component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Layout = ({ children, columns, type }) => (
  <Grid wrap className={styles(type, columns)} data-test-id="productGrid">
    {children}
  </Grid>
);

Layout.propTypes = {
  columns: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
