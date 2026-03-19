import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import Ripple from '@shopgate/pwa-ui-shared/Ripple';

const useStyles = makeStyles()({
  root: {
    padding: '6px 5px 6px 18px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
});

/**
 * Renders the Sort component.
 * @param {Object} props The components props.
 * @returns {JSX}
 */
const Item = ({ children }) => {
  const { classes } = useStyles();

  return (
    <Ripple fill className={classes.root}>
      {children}
    </Ripple>
  );
};

Item.propTypes = {
  children: PropTypes.node,
};

Item.defaultProps = {
  children: null,
};

export default Item;
