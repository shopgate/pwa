import React from 'react';
import PropTypes from 'prop-types';
import { List } from '@shopgate/engage/components';
import styles from './style';

/**
 * The Product List Layout component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Layout = ({ children }) => (
  <List className={styles.list} itemScope itemType="http://schema.org/ItemList" data-test-id="productList">
    {children}
  </List>
);

Layout.propTypes = {
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
