import { useColorScheme } from '@shopgate/engage/styles';
import { Switch } from '@shopgate/engage/components';

/**
 * Provides a toggle switch to change between light and dark color schemes.
 */
const ColorSchemeToggle = () => {
  const { mode, setMode } = useColorScheme();

  return (
    <Switch checked={mode === 'dark'} onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
      Dark mode active
    </Switch>
  );
};

export default ColorSchemeToggle;
