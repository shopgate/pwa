import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export default {
  entering: {
    background: `var(--color-primary, ${colors.primary})`,
    color: `var(--color-secondary-contrast, ${colors.accentContrast})`,
  },
  entered: {
    background: `var(--color-primary, ${colors.primary})`,
    color: `var(--color-secondary-contrast, ${colors.accentContrast})`,
  },
};
