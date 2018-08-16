import React, { Children } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@shopgate/pwa-common/components/List/components/Item';
import styles from './style';

/**
 * The Card List Item component implemented as class so that ref prop is available.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ children, className, isSelected }) => {
  if (!Children.count(children)) {
    return null;
  }

  return (
    <ListItem className={`${styles} ${className}`} isSelected={isSelected}>
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
