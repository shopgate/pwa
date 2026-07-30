import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()((theme, { plain }) => ({
  root: {
    margin: '5px 5px 10px',
    position: 'relative',
    ...!plain && {
      boxShadow: '0 4px 8px rgba(0,0,0,0.16)',
      borderRadius: theme.shape.cardsBorderRadius,
      background: theme.palette.background.surface,
      overflow: 'hidden',
    },
  },
}));

/**
 * Renders the card component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Card = ({
  className, children, id, plain,
}) => {
  const { classes, cx } = useStyles({ plain });

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
  /**
   * Renders the card without its own chrome (background, radius, shadow, clipping), so content
   * that brings its own card styling isn't clipped or double-styled by it.
   */
  plain: PropTypes.bool,
};

Card.defaultProps = {
  className: '',
  id: null,
  plain: false,
};

export default Card;
