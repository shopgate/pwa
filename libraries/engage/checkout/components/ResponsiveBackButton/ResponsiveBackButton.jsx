import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { I18n, ArrowIcon } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { useNavigation } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    padding: theme.spacing(4, 2, 2, 2),
  },
  button: {
    padding: 0,
    textTransform: 'none',
  },
  buttonIcon: {
    display: 'inline-block',
    fontSize: theme.components.icon.medium,
    alignSelf: 'center',
    marginRight: theme.spacing(0.5),
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
      <Button
        variant="text"
        color="primary"
        className={classes.button}
        onClick={handleClick}
      >
        <ArrowIcon className={classes.buttonIcon} />
        <I18n.Text string={label} />
      </Button>
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
