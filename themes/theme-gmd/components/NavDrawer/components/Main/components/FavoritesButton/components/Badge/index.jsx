import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()((theme) => {
  const size = theme.spacing(2) * 1.125;
  return {
    badge: {
      backgroundColor: 'var(--color-primary)',
      borderRadius: size,
      color: 'var(--color-primary-contrast)',
      fontSize: 12,
      fontWeight: 700,
      height: size,
      minWidth: size,
      padding: theme.spacing(0, 0.625),
      position: 'absolute',
      right: 16,
      textAlign: 'center',
      top: 19,
    },
  };
});

/**
 * @param {Object} props The component props.
 * @param {number} props.count  Number of total items on the wishlist.
 * @returns {JSX.Element}
 */
const FavoritesButtonBadge = ({ count }) => {
  const { classes, cx } = useStyles();
  const maxNumber = 999;
  if (count === 0) {
    return null;
  }
  const number = (count > maxNumber) ? `${maxNumber}+` : count;

  return (
    <span
      className={cx(
        classes.badge,
        'theme__nav-drawer__favorites-button-badge',
        'theme__badge'
      )}
    >
      {number}
    </span>
  );
};

FavoritesButtonBadge.propTypes = {
  count: PropTypes.number,
};

FavoritesButtonBadge.defaultProps = {
  count: 0,
};

export default connect(memo(FavoritesButtonBadge));
