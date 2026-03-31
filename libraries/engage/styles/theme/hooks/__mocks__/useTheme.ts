import { createTheme } from '@shopgate/engage/styles/theme/createTheme';

const theme = createTheme({});

/**
 * Mock implementation of the useTheme hook for testing purposes.
 * @returns The theme object.
 */
const useTheme = () => theme;

export default useTheme;
