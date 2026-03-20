import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import BaseCheckbox from '@shopgate/pwa-common/components/Checkbox';
import CheckedIcon from '../icons/RadioCheckedIcon';
import UncheckedIcon from '../icons/RadioUncheckedIcon';

const useStyles = makeStyles()(() => ({
  checkedIcon: {
    width: 24,
    height: 24,
    color: 'var(--color-secondary)',
  },
  uncheckedIcon: {
    width: 24,
    height: 24,
    color: themeConfig.colors.shade6,
  },
}));

/**
 * The RadioButton template component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const RadioButton = (props) => {
  const { classes } = useStyles();

  return (
    <BaseCheckbox
      {...props}
      checkedIcon={<CheckedIcon className={classes.checkedIcon} />}
      uncheckedIcon={<UncheckedIcon className={classes.uncheckedIcon} />}
    />
  );
};

export default RadioButton;
