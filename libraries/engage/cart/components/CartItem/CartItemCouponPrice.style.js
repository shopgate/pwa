// @flow
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export default css({
  fontSize: '1rem',
  fontWeight: 500,
  color: `var(--color-primary, ${colors.primary})`,
}).toString();
