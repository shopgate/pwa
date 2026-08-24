import { RadioGroup, RadioGroupItem } from '@shopgate/engage/components';
import { useColorScheme, makeStyles, type ColorSchemeMode } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    '& .radioGroup': {
      gap: 8,
    },
  },
});

const LABELS: Record<ColorSchemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

/**
 * Provides a picker to choose between the color schemes the theme provides and following the
 * operating system. Renders nothing while the app settings configure a binding color scheme, since
 * a pick would not apply.
 */
const ColorSchemePicker = () => {
  const { classes } = useStyles();
  const {
    mode, modes, setMode, canSelectColorScheme,
  } = useColorScheme();

  if (!canSelectColorScheme) {
    return null;
  }

  return (
    <RadioGroup
      label="Color scheme"
      name="color-scheme"
      direction="row"
      isControlled
      value={mode}
      onChange={(value: ColorSchemeMode) => setMode(value)}
      className={classes.root}
    >
      {modes.map(value => (
        <RadioGroupItem key={value} label={LABELS[value]} name={value} />
      ))}
    </RadioGroup>
  );
};

export default ColorSchemePicker;
