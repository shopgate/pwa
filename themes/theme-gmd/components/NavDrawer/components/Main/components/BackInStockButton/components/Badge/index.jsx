import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './connector';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  badge: {
    background: colors.primary,
    borderRadius: '50%',
    content: ' ',
    display: 'block',
    height: 8,
    position: 'absolute',
    right: 21,
    top: 23,
    width: 8,
  },
});

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
