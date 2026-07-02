import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    boxShadow: '0 4px 8px rgba(0,0,0,0.16)',
    margin: '5px 5px 10px',
    borderRadius: 10,
    background: theme.palette.background.surface,
    overflow: 'hidden',
    position: 'relative',
  },
}));

/**
 * Renders the card component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Card = ({ className, children, id }) => {
  const { classes, cx } = useStyles();

  return (
    <div className={cx('ui-shared__card', classes.root, className)} id={id}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
};

Card.defaultProps = {
  className: '',
  id: null,
};

export default Card;
