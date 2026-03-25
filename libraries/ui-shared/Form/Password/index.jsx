import React, { useState, useCallback } from 'react';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import ToggleIcon from '../../ToggleIcon';
import VisibilityIcon from '../../icons/VisibilityIcon';
import VisibilityOffIcon from '../../icons/VisibilityOffIcon';
import TextField from '../TextField';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  visOff: {
    color: colors.shade4,
  },
});

/**
 * A component that provides a password field with visibility toggle.
 * @param {Object} props Props (same as TextField).
 * @returns {JSX.Element}
 */
const Password = (props) => {
  const { classes } = useStyles();
  const [isVisible, setIsVisible] = useState(false);

  const togglePasswordVisibility = useCallback((visible) => {
    setIsVisible(visible);
  }, []);

  return (
    <TextField
      {...props}
      className={`ui-shared__form__password ${props.className || ''}`}
      rightElement={(
        <ToggleIcon
          on={isVisible}
          onIcon={<VisibilityIcon size={24} />}
          offIcon={<VisibilityOffIcon size={24} className={classes.visOff} />}
          toggleHandler={togglePasswordVisibility}
        />
      )}
      type={isVisible ? 'text' : 'password'}
    />
  );
};

Password.propTypes = TextField.propTypes;

export default Password;
