import React from 'react';
import PropTypes from 'prop-types';
import List from '@shopgate/pwa-common/components/List';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  list: {
    background: theme.palette.background.default,
  },
}));

/**
 * The Product List Layout component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Layout = ({ children }) => {
  const { classes, cx } = useStyles();

  return (
    <List className={cx(classes.list, 'engage__product__product-list')} itemScope itemType="http://schema.org/ItemList" data-test-id="productList">
      {children}
    </List>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
