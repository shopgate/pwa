import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  badge: {
    background: theme.palette.primary.main,
    borderRadius: '50%',
    content: ' ',
    display: 'block',
    height: 8,
    position: 'absolute',
    right: 21,
    top: 23,
    width: 8,
  },
}));

/**
 * @param {number} visible Whether or not the user has back in stock subscriptions.
 * @returns {JSX}
 */
const BackInStockButtonBadge = ({ visible }) => {
  const { classes, cx } = useStyles();
  return (
    (visible > 0) && (
      <span
        className={cx(
          classes.badge,
          'theme__nav-drawer__back-in-stock-button-badge',
          'theme__badge'
        )}
      />
    )
  );
};

BackInStockButtonBadge.propTypes = {
  visible: PropTypes.number.isRequired,
};

export default connect(memo(BackInStockButtonBadge));
