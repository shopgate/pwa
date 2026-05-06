import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { Ripple } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import TrashOutlineIcon from '@shopgate/pwa-ui-shared/icons/TrashOutlineIcon';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    borderRadius: '50%',
    color: theme.palette.text.primary,
    fontSize: '1.5rem',
    padding: '0 8px 8px 8px',
    lineHeight: 1,
    outline: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -1,
  },
  ripple: {
    flexShrink: 0,
  },
}));

/**
 * The remove favorites button component.
 * @returns {JSX}
 */
const RemoveButton = ({ onClick }) => {
  const { classes } = useStyles();

  return (
    <button
      className={classes.root}
      onClick={onClick}
      type="button"
      aria-label={i18n.text('favorites.remove')}
    >
      <Ripple className={classes.ripple}>
        <TrashOutlineIcon />
      </Ripple>
    </button>
  );
};

RemoveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default RemoveButton;
