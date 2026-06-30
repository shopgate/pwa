import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  RippleButton, I18n, ArrowIcon, Typography,
} from '@shopgate/engage/components';
import { useNavigation } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    padding: theme.spacing(4, 2, 2, 2),
  },
  button: {
    padding: '0 !important',
    ' > div ': {
      padding: 0,
      display: 'flex',
    },
  },
  buttonIcon: {
    display: 'inline-block',
    fontSize: `${theme.components.icon.medium} !important`,
    alignSelf: 'center',
    marginRight: theme.spacing(0.5),
    marginLeft: -3,
    marginTop: -2,
  },
}));

/**
 * A back button  for the desktop checkout pages.
 * @returns {JSX}
 */
const ResponsiveBackButton = ({ label, onClick }) => {
  const { classes } = useStyles();
  const { pop } = useNavigation();

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
      return;
    }

    pop();
  }, [onClick, pop]);

  return (
    <div className={classes.container}>
      <RippleButton
        flat
        className={classes.button}
        type="secondary"
        onClick={handleClick}
      >
        <ArrowIcon className={classes.buttonIcon} />
        <Typography variant="body2" component="span" fontWeight="bold">
          <I18n.Text string={label} />
        </Typography>
      </RippleButton>
    </div>
  );
};

ResponsiveBackButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
};

ResponsiveBackButton.defaultProps = {
  label: 'common.back',
  onClick: null,
};

export default ResponsiveBackButton;
