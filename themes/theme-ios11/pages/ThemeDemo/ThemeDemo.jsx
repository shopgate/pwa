import { memo } from 'react';
import { View } from '@shopgate/engage/components';
import { DefaultBar } from 'Components/AppBar/presets';
import { makeStyles } from '@shopgate/engage/styles';
import Palette from './Palette';
import ColorSchemeToggle from './ColorSchemeToggle';
import CSSColorOverride from './CSSColorOverride';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
  },
}));

/**
 * The ThemeDemo component is used to demonstrate the theme capabilities of the theme
 * @returns {JSX.Element}
 */
const ThemeDemo = () => {
  const { classes } = useStyles();

  return (
    <View noContentPortal>
      <DefaultBar title="Theme Demo" />
      <div className={classes.root}>
        <ColorSchemeToggle />
        <CSSColorOverride />
        <Palette />
      </div>
    </View>
  );
};

export default memo(ThemeDemo);
