import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    boxShadow: themeConfig.shadows.productCard,
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
