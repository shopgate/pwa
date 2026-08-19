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
 * operating system.
 */
const ColorSchemePicker = () => {
  const { classes } = useStyles();
  const { mode, modes, setMode } = useColorScheme();

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
