import React, { Children } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@shopgate/pwa-common/components/List/components/Item';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    background: themeConfig.colors.light,
    marginBottom: theme.spacing(0.5),
    position: 'relative',
  },
}));

/**
 * The Card List Item component implemented as class so that ref prop is available.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ children, className, isSelected }) => {
  const { classes, cx } = useStyles();

  if (!Children.count(children)) {
    return null;
  }

  return (
    <ListItem className={cx(classes.root, className)} isSelected={isSelected}>
      {children}
    </ListItem>
  );
};

Item.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isSelected: PropTypes.bool,
};

Item.defaultProps = {
  children: null,
  className: null,
  isSelected: false,
};

export default Item;
