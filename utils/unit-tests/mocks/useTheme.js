/**
 * Mock for @shopgate/engage/styles/theme/hooks/useTheme.
 *
 * The published packages don't contain their __mocks__ folders, so consumers like extensions can't
 * rely on the manual mock of the package itself. Without a theme object the styles of components
 * from @shopgate/pwa-ui-shared throw when they access theme values.
 *
 * The theme is created with the published createTheme helper, so this mock doesn't need to
 * duplicate any theme defaults.
 */
const { createTheme } = require('@shopgate/engage/styles/theme/createTheme');

const theme = createTheme({});

module.exports = {
  __esModule: true,
  default: () => theme,
};
