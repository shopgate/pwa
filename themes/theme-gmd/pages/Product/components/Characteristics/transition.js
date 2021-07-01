import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export default {
  entering: {
    background: colors.primary,
    color: colors.primaryContrast,
  },
  entered: {
    background: colors.primary,
    color: colors.primaryContrast,
  },
};
