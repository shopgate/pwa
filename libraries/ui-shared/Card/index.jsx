import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { themeConfig, themeName } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const isIOS = themeName.includes('ios');

const useStyles = makeStyles()({
  root: {
    boxShadow: themeConfig.shadows.productCard,
    margin: '5px 5px 10px',
    borderRadius: isIOS ? 10 : 2,
    background: themeConfig.colors.light,
    overflow: 'hidden',
    position: 'relative',
  },
});

/**
 * Renders the card component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Card = ({ className, children, id }) => {
  const { classes } = useStyles();

  return (
    <div className={classNames('ui-shared__card', classes.root, className)} id={id}>
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
